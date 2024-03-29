interface Venue {
  source: {
    display_name?: string;
  };
  landing_page_url?: string;
}

interface Author {
  display_name: string;
  id: string;
}

interface Institution {
  display_name: string;
}

export interface Authorship {
  author: Author;
  institutions: Institution[];
}

export interface Work {
  display_name: string;
  publication_date: string;
  primary_location: Venue;
  authorships: Authorship[];
  doi: string;
}

export interface WorksResponse {
  results: Work[];
}

export interface AuthorsResponse {
  results: Author[];
}
