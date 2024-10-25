export  interface Movie {
    id: number;
    title: string;
    description: string;
    poster_path: string;
    rating: number;
    year: string;
}


export interface CardData{
  title: string;
  imagePath: string;
  releaseYear: string;
  rating: number;
  id:number
}
/*
{
    "adult": false,
    "backdrop_path": "/417tYZ4XUyJrtyZXj7HpvWf1E8f.jpg",
    "genre_ids": [
        16,
        878,
        10751
    ],
    "id": 1184918,
    "original_language": "en",
    "original_title": "The Wild Robot",
    "overview": "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island's animals and cares for an orphaned baby goose.",
    "popularity": 4950.682,
    "poster_path": "/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
    "release_date": "2024-09-12",
    "title": "The Wild Robot",
    "video": false,
    "vote_average": 8.7,
    "vote_count": 1412
}
*/