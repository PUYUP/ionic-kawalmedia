import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-component-submit-media',
  templateUrl: './submit-media.component.html',
  styleUrls: ['./submit-media.component.scss'],
})
export class SubmitMediaComponent implements OnInit {

  createFormGroup: any = FormGroup;
  classifieds: any;
  options: any;
  basicsAttr: any;
  isLoading: boolean = false;
  isLoadingInit: boolean = false;
  submitParam: any = ['label', 'classified', 'description', 'website']
  searchMediaInput = new Subject<string>();
  listeds: any;
  listedsList: any;
  mediaListed: boolean = false;
  searchLoading: boolean = false;

  constructor(
    public cdRef: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    public router: Router,
    private escortService: EscortService) {
  }

  ngOnInit() {
    // Init attributes
    this.loadField();

    // Debounce search.
    this.searchMediaInput.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe(value => {
      this.mediaListed = false;
      this.searchMedia(value);
    });
  }

  searchMedia(term: any) {
    this.searchLoading = true;
    this.escortService.getMedias({ 'term': term, 'match': 1 })
      .pipe(
        finalize(() => {
          this.searchLoading = false;
          // setInterval(() => { this.cdRef.detectChanges(); }, 10);
        })
      )
      .subscribe(
        response => {
          this.listeds = response;

          if (this.listeds.count > 0) {
            this.listedsList = this.listeds.results;
            this.mediaListed = true;
            this.listedsList = this.listedsList.map((e: { label: any; }) => e.label).join(', ');

            // this.cdRef.detach();
          }
        },
        failure => {
          // Error
        }
      );
  }

  createForm(options: any): void {
    let fieldControl = new FormGroup({});

    for (let option of options) {
      const identifier = option.identifier;
      const type = option.type;
      const value_obj = option.value;
      let values = value_obj.object;

      // Multiple select (checkbox)
      // Is an array form control!
      if (type === 'multi_option') {
        const formArray = new FormArray([]);
        const optionGroups = option.option_group;

        // Append dynamic formControl
        for (let opt of optionGroups) {
          let value = values.find((e: any) => e === opt.id);
          let field = new FormControl()

          // Set value here
          if (value) {
            field.setValue(opt.id);
          }

          // Set validators
          if (value_obj.required === true) {
            field.setValidators([Validators.required]);
          }

          // Now append to formArray
          formArray.push(field)
        }

        // Create the control
        fieldControl.addControl(identifier, formArray);
      }

      // Text, option, and other
      if (type !== 'multi_option') {
        // Add validation here!
        if (type === 'option' && values == null || values == undefined) values = '';
        let field = new FormControl(values, []);

        // Assign validators
        if (value_obj.required === true) {
          field.setValidators([Validators.required]);
        }

        // URL validators
        if (type === 'url') {
          field.setValidators([Validators.required, Validators.pattern('https?://.+')]);
        }

        fieldControl.addControl(identifier, field);
      }
    }

    // Call on template...
    this.createFormGroup = fieldControl;
  }

  loadField(): any {
    this.isLoadingInit = true;
    return forkJoin(
      this.escortService.getClassifieds(),
      this.escortService.getOptions({ identifiers: this.submitParam }))
      .subscribe(([classifieds, options]) => {
        let attributes = options.attributes;
        let basics = options.basics;

        // Remove field
        attributes = attributes.filter(function (obj: { identifier: string; }) {
          return obj.identifier !== 'logo';
        });

        // Clear form without file field
        for (let opt of basics.reverse()) {
          attributes.unshift(opt);
        }

        // Add classifieds
        if (classifieds) {
          let classifiedIndex = attributes.findIndex((x: { identifier: string; }) => x.identifier === 'classified');
          if (classifiedIndex) {
            attributes[classifiedIndex].option_group = classifieds;
          }
        }

        this.options = attributes;
        this.createForm(this.options);
        this.isLoadingInit = false;
      });
  }

  formSubmit(): any {
    this.isLoading = true;
    this.escortService.postSubmitMedia(this.createFormGroup.value)
      .pipe(
        finalize(() => {
          this.createFormGroup.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/media', response.uuid], {replaceUrl: true});
        },
        failure => {

        }
      );
  }

}
