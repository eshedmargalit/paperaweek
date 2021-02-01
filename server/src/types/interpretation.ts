// Source: https://docs.microsoft.com/en-us/academic-services/project-academic-knowledge/reference-paper-entity-attributes#source
const SourceURLTypes = {
  1: 'HTML',
  2: 'Text',
  3: 'PDF',
  4: 'DOC',
  5: 'PPT',
  6: 'XLS',
  7: 'PS',
};

export interface Entity {
  logprob: number; // Natural log probability of the interpretation. Larger is more likely.
  prob: number;
  Id: number; // The entity ID
  Y: number; // Year published
  D: string; // Date published in YYYY-MM-DD format
  DN: string; // Original paper title
  DOI: string; // Digital Object Identifier
  VFN: string; // Full name of the Journal or Conference venue
  S: Array<{
    Ty: keyof typeof SourceURLTypes; // Source URL type
    U: string; // Source URL
  }>; // List of source URLs of the paper, listed in relevance order
  AA: Array<{
    DAuN: string; // Original author name
    DAfN: string; // Original affiliation name
    S: number; // Author's numeric position in author list
  }>; // Author affiliation
}
export interface Interpretation {
  rules: [
    {
      output: {
        entities: Entity[];
        value: string;
      };
    }
  ];
  parse: string;
  logprob: number;
}

export interface InterpretationResponse {
  interpretations: Interpretation[];
}

export interface EvaluateResponse {
  expr: string;
  entities: Entity[];
}
