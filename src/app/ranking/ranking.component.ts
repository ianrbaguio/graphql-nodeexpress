import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const RANKINGS_QUERY = gql`
  query ranking($rank: String!) {
    ranking(rank: $rank) {
      ranking_date
      rank
      points
      player
      playerinfo {
        name_first
        name_list
      }
    }
  }
`;

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  rank: number = 1;
  rankings: any[];
  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: RANKINGS_QUERY,
      variables: { rank: Math.round(this.rank).toString() }
    });

    this.query.valueChanges.subscribe(result => {
      this.rankings = result.data && result.data.ranking;
    });
  }

  update() {
    return this.query.refetch({ rank: Math.round(this.rank).toString() });
  }
}

