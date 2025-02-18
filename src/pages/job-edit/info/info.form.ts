import { max, min, pattern, required } from 'src/core/form';
import { noEmptyString } from 'src/core/form/customValidators/customValidators';
import { FormModel } from 'src/core/form/useForm/useForm.types';
import { CreatePostWizard } from 'src/store/reducers/createPostWizard.reducer';

export function formModel(formState: CreatePostWizard): FormModel {
  return {
    title: {
      initialValue: formState.title,
      validators: [noEmptyString()],
    },
    job_category_id: {
      initialValue: formState.job_category_id,
      validators: [required()],
    },
    description: {
      initialValue: formState.description,
      validators: [noEmptyString()],
    },
    country: {
      initialValue: formState.country,
      validators: [required()],
    },
    city: {
      initialValue: formState.city,
      validators: [required()],
    },
    remote_preference: {
      initialValue: formState.remote_preference,
      validators: [required()],
    },
    project_type: {
      initialValue: formState.project_type,
      validators: [required()],
    },
    project_length: {
      initialValue: formState.project_length,
      validators: [required()],
    },
    experience_level: {
      initialValue: formState.experience_level,
      validators: [required()],
    },
    payment_range_lower: {
      initialValue: formState.payment_range_lower,
      validators: [
        required(),
        pattern('patternName', /^[+-]?\d+(\.\d+)?$/, 'value should be a number'),
        max(Number(formState.payment_range_higher), 'value should lower than maximum'),
      ],
    },
    payment_range_higher: {
      initialValue: formState.payment_range_higher,
      validators: [
        required(),
        pattern('patternName', /^[+-]?\d+(\.\d+)?$/, 'value should be a number'),
        min(Number(formState.payment_range_lower), 'value should higher than minimum'),
      ],
    },
  };
}
