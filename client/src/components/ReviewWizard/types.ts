import { Notes, Paper } from "../../types";
import { FormikProps } from 'formik';

type PAWProps = Paper | Notes;
export type PAWFormikProps = FormikProps<PAWProps>;