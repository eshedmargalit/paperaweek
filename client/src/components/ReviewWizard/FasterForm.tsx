// Not sure how to resolve this error to be honest... moving the <FieldArray> inside the <label> doesn't help
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Row, Space, Tooltip } from 'antd';
import { uniq as _uniq } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Notes, Paper, Review } from '../../types';
import './ReviewWizard.scss';
import { bulletNoteFields } from './utils';
import { DraftsContext } from '../../contexts';
import { TextField, MonthPicker, DynamicList, DynamicTextAreaList } from './FasterFormComponents';

export interface StringObj {
  contents: string;
}
type FormPaper = Omit<Paper, 'authors' | 'institutions'> & { authors: StringObj[]; institutions: StringObj[] };
type FormNotes = Pick<Notes, 'tldr' | 'keywords'> & {
  overview: StringObj[];
  background: StringObj[];
  methods: StringObj[];
  results: StringObj[];
  conclusions: StringObj[];
  other: StringObj[];
};

export type FormReview = {
  paper: FormPaper;
  notes: FormNotes;
};

/**
 * Schema Rules in Plain English
 * 1. At least one author, each other must have at least one character in their name
 * 2. A title with at least one character
 */
const PAWFormSchema = Yup.object().shape({
  paper: Yup.object().shape({
    authors: Yup.array()
      .of(
        Yup.string()
          .required('Paper author must have at least one character.')
          .min(1)
      )
      .min(1)
      .required('Paper must have at least one author.'),
    title: Yup.string()
      .required('Paper must have a title.')
      .min(1),
  }),
});

const splitKeywordsIntoArray = (keywords: string | string[]): string[] => {
  if (Array.isArray(keywords)) {
    return keywords;
  }

  return _uniq(
    keywords.split(',').map(item => {
      return item.trim().toLowerCase();
    })
  );
};

const objectArrayToStringArray = (arr: StringObj[]): string[] => arr.map(s => s.contents);
const stringArrayToObjectArray = (arr: string[]): StringObj[] => arr.map(s => ({ contents: s }));

export const convertFormValues = (review: FormReview): Review => ({
  ...review,
  paper: {
    ...review.paper,
    authors: objectArrayToStringArray(review.paper.authors),
    institutions: objectArrayToStringArray(review.paper.institutions),
  },
  notes: {
    ...review.notes,
    overview: objectArrayToStringArray(review.notes.overview),
    background: objectArrayToStringArray(review.notes.background),
    methods: objectArrayToStringArray(review.notes.methods),
    results: objectArrayToStringArray(review.notes.results),
    conclusions: objectArrayToStringArray(review.notes.conclusions),
    other: objectArrayToStringArray(review.notes.other),
    keywords: splitKeywordsIntoArray(review.notes.keywords),
  },
});

const convertToFormValues = (review: Review): FormReview => ({
  ...review,
  notes: {
    ...review.notes,
    overview: stringArrayToObjectArray(review.notes.overview),
    background: stringArrayToObjectArray(review.notes.background),
    methods: stringArrayToObjectArray(review.notes.methods),
    results: stringArrayToObjectArray(review.notes.results),
    conclusions: stringArrayToObjectArray(review.notes.conclusions),
    other: stringArrayToObjectArray(review.notes.other),
  },
  paper: {
    ...review.paper,
    authors: stringArrayToObjectArray(review.paper.authors),
    institutions: stringArrayToObjectArray(review.paper.institutions),
  },
});

interface FasterFormProps {
  initialReview: Review;
  onChange: (formValues: Review) => void;
  onSubmit: (formValues: Review) => void;
}

export default function FasterForm({ initialReview, onChange, onSubmit }: FasterFormProps): JSX.Element {
  const { control, register, handleSubmit, getValues } = useForm({ defaultValues: convertToFormValues(initialReview) });

  const convertAndSave = () => onChange(convertFormValues(getValues()));
  const convertAndSubmit = (formReview: FormReview) => onSubmit(convertFormValues(formReview));

  const reviewItemColSpan = {
    lg: 12,
    sm: 24,
  };

  return (
    <form>
      <DraftsContext.Provider value={convertAndSave}>
        <div className="paw-form">
          <div className="section-title">
            <h2> Paper Information </h2>
          </div>
          <Row className="form-group" gutter={16}>
            <Col {...reviewItemColSpan}>
              <TextField label="Paper Title" name="paper.title" register={register} onBlurHandler={convertAndSave} />
            </Col>
            <Col {...reviewItemColSpan}>
              <MonthPicker label="Publication Month" name="paper.date" control={control} />
            </Col>
            <Col {...reviewItemColSpan}>
              <DynamicList label="Authors" name="paper.authors" control={control} onBlurHandler={convertAndSave} />
            </Col>
            <Col {...reviewItemColSpan}>
              <DynamicList
                label="Institutions"
                name="paper.institutions"
                control={control}
                onBlurHandler={convertAndSave}
              />
            </Col>
            <Col lg={8} sm={24}>
              <TextField label="Journal" name="paper.journal" register={register} onBlurHandler={convertAndSave} />
            </Col>
            <Col lg={8} sm={24}>
              <TextField label="URL" name="paper.url" register={register} onBlurHandler={convertAndSave} />
            </Col>
            <Col lg={8} sm={24}>
              <TextField label="DOI" name="paper.doi" register={register} onBlurHandler={convertAndSave} />
            </Col>
          </Row>
          <div className="section-title">
            <h2> Your Review </h2>
          </div>
          <Row className="form-group" gutter={16}>
            {bulletNoteFields.map(({ fieldName, label, tooltip }) => (
              <Col key={label} {...reviewItemColSpan}>
                <label htmlFor={fieldName}>
                  <Space>
                    {label}
                    <Tooltip title={tooltip}>
                      <QuestionCircleFilled />
                    </Tooltip>
                  </Space>
                </label>
                <DynamicTextAreaList name={`notes.${fieldName}`} control={control} onBlurHandler={convertAndSave} />
              </Col>
            ))}
          </Row>
          <Row gutter={16}>
            <Col {...reviewItemColSpan}>
              <TextField
                label="TLDR (One Sentence Summary)"
                name="notes.tldr"
                onBlurHandler={convertAndSave}
                register={register}
              />
            </Col>
            <Col {...reviewItemColSpan}>
              <TextField
                label="Keywords"
                name="notes.keywords"
                register={register}
                placeholder="human, fmri, statistics"
                onBlurHandler={convertAndSave}
              />
            </Col>
          </Row>
          <br />
          <Button shape="round" type="primary" onClick={handleSubmit(convertAndSubmit)}>
            Continue to Preview
          </Button>
        </div>
      </DraftsContext.Provider>
    </form>
  );
}
