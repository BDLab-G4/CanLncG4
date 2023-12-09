// lncrna_name: string;
// cancer_name: string;
// methods: string;
// num_transcript_variants: string | number;
// pubmed_id: string;
// expression_pattern: string;
// aliases: string[];
export type Person = {
 lncrna_name: string;
 cancer_name: string;
  methods: string;
  // num_transcript_variants: string | number;
  pubmed_id: string;
  expression_pattern: string;
  aliases: string[];
};


export const data = [
  {
    lncrna_name: '',
    cancer_name: '',
    methods: 'Loading',
    // num_transcript_variants: '',
    pubmed_id: '',
    expression_pattern: '',
    aliases:['','']
  }
] as Person[];
