import { Formik } from 'formik';
import React from 'react';

/**
 * wrapWithFormik wraps your component in a Formik context
 */
export function wrapWithFormik<T>(ui: React.ReactElement, formikFieldName: string, initialValue: T): JSX.Element {
  return (
    <Formik initialValues={{ [formikFieldName]: initialValue }} onSubmit={jest.fn()}>
      {ui}
    </Formik>
  );
}
