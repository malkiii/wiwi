import { Input } from '~/components/ui/input';
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { cn } from '~/lib/utils';

type InputFieldProps = React.PropsWithChildren<
  Omit<React.ComponentProps<typeof FormField>, 'render'> & {
    className?: string;
    fieldProps?: React.ComponentProps<typeof Input>;
  }
>;

export function InputField({ children, className, fieldProps, ...props }: InputFieldProps) {
  return (
    <FormField
      {...props}
      render={({ field, formState }) => (
        <FormItem className={cn(className)}>
          {children}
          <FormControl>
            <Input
              id={props.name}
              {...fieldProps}
              className={cn(
                formState.errors[props.name] && 'border-destructive',
                fieldProps?.className,
              )}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
