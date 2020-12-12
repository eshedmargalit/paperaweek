import { FormikProps } from 'formik';
import { Notes, Paper } from '../../types';

export type PAWProps = Paper & Notes;
export type PAWFormikProps = FormikProps<PAWProps>;
export type OnClickEventType = (e: React.MouseEvent<HTMLElement>) => void;
