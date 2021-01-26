class AnimeRelated {
	constructor(animeJson){
		this.id = animeJson['id'];
		this.title = animeJson['title'];
		this.startDate = animeJson['start_date'];
		this.relatedSize = animeJson['related_anime'].length;
		this.relatedRelatedListIDs = parseRelatedList(animeJson['related_anime']);
	}

	parseRelatedList(related_anime){
		return animeJson['related_anime'].length;
	}
}