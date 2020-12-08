import { Notes, Paper } from "../../types";
import { FormikProps } from 'formik';

export type PAWProps = Paper & Notes;
export type PAWFormikProps = FormikProps<PAWProps>;