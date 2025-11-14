import {
  Button,
  Checkbox,
  cn,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@seapunk/ui';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FieldConfig, FieldProps } from './types';

// Error message component
const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <p className='text-sm text-red-500 mt-1'>{message}</p>;
};

// Description component
const FieldDescription: React.FC<{ description?: string }> = ({
  description,
}) => {
  if (!description) return null;
  return <p className='text-sm text-muted-foreground mt-1'>{description}</p>;
};

// Text input field
const TextFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<
    FieldConfig,
    { type: 'text' | 'email' | 'password' | 'url' }
  >;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            id={config.name}
            type={fieldConfig.type}
            placeholder={config.placeholder}
            disabled={config.disabled}
            maxLength={fieldConfig.maxLength}
            className={error ? 'border-red-500' : ''}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Number input field
const NumberFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<FieldConfig, { type: 'number' }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            id={config.name}
            type='number'
            placeholder={config.placeholder}
            disabled={config.disabled}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.step}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              field.onChange(e.target.value ? Number(e.target.value) : '')
            }
            className={error ? 'border-red-500' : ''}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Textarea field
const TextareaFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<FieldConfig, { type: 'textarea' }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={config.name}
            placeholder={config.placeholder}
            disabled={config.disabled}
            rows={fieldConfig.rows}
            maxLength={fieldConfig.maxLength}
            className={error ? 'border-red-500' : ''}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Select field
const SelectFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<FieldConfig, { type: 'select' }>;
  const error = form.formState.errors[config.name]?.message as string;

  if (fieldConfig.multiple) {
    // Multi-select implementation would require a custom component
    // For now, we'll implement single select
    console.warn(
      'Multi-select not yet implemented, falling back to single select'
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={config.disabled}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Checkbox field
const CheckboxFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <div className='flex items-center space-x-2'>
            <Checkbox
              id={config.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={config.disabled}
            />
            <Label
              htmlFor={config.name}
              className={
                config.required ? 'after:content-["*"] after:text-red-500' : ''
              }
            >
              {config.label}
            </Label>
          </div>
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Radio group field
const RadioGroupFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<FieldConfig, { type: 'radio' }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={config.disabled}
          >
            {fieldConfig.options.map((option) => (
              <div key={option.value} className='flex items-center space-x-2'>
                <RadioGroupItem
                  value={String(option.value)}
                  id={`${config.name}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label htmlFor={`${config.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Date field
const DateFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<
    FieldConfig,
    { type: 'date' | 'datetime-local' | 'time' }
  >;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            id={config.name}
            type={fieldConfig.type}
            disabled={config.disabled}
            className={error ? 'border-red-500' : ''}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// File field
const FileFieldComponent: React.FC<FieldProps> = ({
  config,
  form,
  className,
}) => {
  const fieldConfig = config as Extract<FieldConfig, { type: 'file' }>;
  const error = form.formState.errors[config.name]?.message as string;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={config.name}
        className={
          config.required ? 'after:content-["*"] after:text-red-500' : ''
        }
      >
        {config.label}
      </Label>
      <Controller
        name={config.name}
        control={form.control}
        render={({ field: { onChange, value, ...field } }) => (
          <Input
            {...field}
            id={config.name}
            type='file'
            accept={fieldConfig.accept}
            multiple={fieldConfig.multiple}
            disabled={config.disabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.files)
            }
            className={error ? 'border-red-500' : ''}
          />
        )}
      />
      <ErrorMessage message={error} />
      <FieldDescription description={config.description} />
    </div>
  );
};

// Custom field component for handling special field types
const CustomFieldComponent: React.FC<FieldProps> = ({ config, className }) => {
  const fieldConfig = config as Extract<FieldConfig, { type: 'custom' }>;

  const handleDeleteClick = () => {
    if (
      fieldConfig.customComponent === 'deleteButton' &&
      fieldConfig.customProps
    ) {
      const { itemId, itemName } = fieldConfig.customProps;

      if (
        window.confirm(`¿Estás seguro de que quieres eliminar "${itemName}"?`)
      ) {
        // Get the delete handler from the form context or global context
        const deleteHandler = (window as any).__deleteInventoryHandler;
        if (deleteHandler) {
          deleteHandler(itemId, itemName);
        } else {
          toast.error('No se pudo eliminar el objeto. Inténtalo de nuevo.');
        }
      }
    }
  };

  if (fieldConfig.customComponent === 'deleteButton') {
    return (
      <div className={cn('space-y-2', className)}>
        <Label>{fieldConfig.label}</Label>
        <Button
          type='button'
          variant={fieldConfig.customProps?.variant || 'destructive'}
          size={fieldConfig.customProps?.size || 'sm'}
          onClick={handleDeleteClick}
          className='w-full'
        >
          <Trash2 className='h-4 w-4 mr-2' />
          Eliminar
        </Button>
      </div>
    );
  }

  return null;
};

// Main field component that renders the appropriate field type
export const FormField: React.FC<FieldProps<FieldValues>> = ({
  config,
  form,
  className,
}) => {
  const combinedClassName = cn(config.className, className);

  switch (config.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
      return (
        <TextFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'number':
      return (
        <NumberFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'textarea':
      return (
        <TextareaFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'select':
      return (
        <SelectFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'checkbox':
      return (
        <CheckboxFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'radio':
      return (
        <RadioGroupFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'date':
    case 'datetime-local':
    case 'time':
      return (
        <DateFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'file':
      return (
        <FileFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    case 'custom':
      return (
        <CustomFieldComponent
          config={config}
          form={form}
          className={combinedClassName}
        />
      );
    default:
      console.warn(`Unknown field type: ${(config as any).type}`);
      return null;
  }
};
