import { FormikProps } from 'formik';
import { Review } from '../../types';

export type PAWFormikProps = FormikProps<Review>;
export type OnClickEventType = (e: React.MouseEvent<HTMLElement>) => void;
