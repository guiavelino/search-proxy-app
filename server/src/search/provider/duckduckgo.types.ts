export interface DuckDuckGoTopic {
  Text?: string;
  FirstURL?: string;
}

export interface DuckDuckGoTopicGroup {
  Name: string;
  Topics: DuckDuckGoTopic[];
}

export interface DuckDuckGoResponse {
  RelatedTopics: (DuckDuckGoTopic | DuckDuckGoTopicGroup)[];
  Results: DuckDuckGoTopic[];
}
