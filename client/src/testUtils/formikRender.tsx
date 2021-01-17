import { Formik } from 'formik';
import React from 'react';

/**
 * renderWithFormik will help you render your component in a mocked Formik context
 */
export function renderWithFormik<T>(ui: React.ReactElement, formikFieldName: string, initialValue: T): JSX.Element {
  return (
    <Formik initialValues={{ [formikFieldName]: initialValue }} onSubmit={jest.fn()}>
      {ui}
    </Formik>
  );
}
