/* eslint-disable import/no-extraneous-dependencies */
import { render, RenderResult } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';

/**
 * renderWithFormik will render your component in a mocked Formik context
 */
export function renderWithFormik<T>(ui: React.ReactElement, formikFieldName: string, initialValue: T): RenderResult {
  return render(
    <Formik initialValues={{ [formikFieldName]: initialValue }} onSubmit={jest.fn()}>
      {ui}
    </Formik>
  );
}
