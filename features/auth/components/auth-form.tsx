'use client';

import { cn } from '@/lib/utils';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn, signUp } from '../auth-client';
import {
  signInAuthFormSchema,
  signUpAuthFormSchema,
  type AuthFormValues,
} from '../schemas';

type AuthMode = 'sign-in' | 'sign-up';

const defaultAuthFormValues: AuthFormValues = {
  name: '',
  email: '',
  password: '',
};

export function AuthForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === 'sign-up';

  const form = useForm({
    defaultValues: defaultAuthFormValues,
    validators: {
      onSubmit: isSignUp ? signUpAuthFormSchema : signInAuthFormSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        const result = isSignUp
          ? await signUp.email({
              email: value.email,
              password: value.password,
              name: value.name,
            })
          : await signIn.email({
              email: value.email,
              password: value.password,
            });

        if (result.error) {
          setError(result.error.message ?? 'Authentication failed');
          return;
        }

        toast.success(isSignUp ? 'Account created' : 'Signed in');
        form.reset(defaultAuthFormValues);
        router.replace('/pokemon');
        router.refresh();
      } catch (unknownError) {
        const message =
          unknownError instanceof Error
            ? unknownError.message
            : 'Authentication failed';

        setError(message);
      }
    },
  });

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    form.reset(defaultAuthFormValues);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isSignUp ? 'Create your account' : 'Login to your account'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details to start your collection'
              : 'Enter your email below to login to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <FieldGroup>
                  {isSignUp && (
                    <form.Field name="name">
                      {(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="text"
                              autoComplete="name"
                              placeholder="Ash Ketchum"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              disabled={isSubmitting}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    </form.Field>
                  )}
                  <form.Field name="email">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            autoComplete="email"
                            placeholder="m@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            disabled={isSubmitting}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                  <form.Field name="password">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="password"
                            autoComplete={
                              isSignUp ? 'new-password' : 'current-password'
                            }
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            disabled={isSubmitting}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  {error && <FieldError>{error}</FieldError>}

                  <Field>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="animate-spin" />}
                      {isSignUp ? 'Create account' : 'Login'}
                    </Button>
                    <FieldDescription className="text-center">
                      {isSignUp
                        ? 'Already have an account?'
                        : 'Don’t have an account?'}{' '}
                      <button
                        className="hover:text-primary underline underline-offset-4"
                        type="button"
                        onClick={() =>
                          switchMode(isSignUp ? 'sign-in' : 'sign-up')
                        }
                        disabled={isSubmitting}
                      >
                        {isSignUp ? 'Login' : 'Sign up'}
                      </button>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
