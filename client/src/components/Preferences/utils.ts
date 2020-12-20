// These aren't typed because they're so specific and not reusable, the inferred literal type serves
// our purposes just fine.

export const formItemLayout = {
  labelCol: {
    xl: { span: 3 },
    lg: { span: 24 },
  },
};

export const formItemLayoutWithoutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 },
  },
};