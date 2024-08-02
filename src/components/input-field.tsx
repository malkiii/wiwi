import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { cn } from '~/lib/utils';

type InputFieldProps = React.PropsWithChildren<
  Omit<React.ComponentProps<typeof FormField>, 'render'> & { className?: string } & (
      | { isArea?: false; fieldProps?: React.ComponentProps<typeof Input> }
      | { isArea: true; fieldProps?: React.ComponentProps<typeof Textarea> }
    )
>;

export function InputField({ children, className, fieldProps, isArea, ...props }: InputFieldProps) {
  return (
    <FormField
      {...props}
      render={({ field, formState }) => (
        <FormItem className={cn(className)}>
          {children}
          <FormControl>
            {isArea ? (
              <Textarea
                {...fieldProps}
                className={cn(
                  'block max-h-fit w-full resize-none',
                  formState.errors[props.name] && 'border-destructive',
                  fieldProps?.className,
                )}
                {...field}
              />
            ) : (
              <Input
                id={props.name}
                {...fieldProps}
                className={cn(
                  formState.errors[props.name] && 'border-destructive',
                  fieldProps?.className,
                )}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
