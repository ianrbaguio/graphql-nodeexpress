import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef} from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import gql from 'graphql-tag';

/* Initiate the query for rankings */
const RANKINGS_QUERY = gql`
  query rankings{
    rankings{
      ranking_date
      rank
      player
      points
      playerinfo{
        player_id
        name_first
        name_list
        hand
        birthdate
        country
    }
  }
}
`;

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {

  gRankings: any[]; //GraphQL Rankings

  rRankings: any; //REST Rankings
  rPlayers: any;
  rPlayerRankings: any;
  private query: QueryRef<any>

  constructor(private apollo: Apollo, private httpClient: HttpClient) {}

  ngOnInit() {
    // GraphQL Init
    this.query = this.apollo.watchQuery({
      query: RANKINGS_QUERY
    });

    this.query.valueChanges.subscribe(result => {
      this.gRankings = result.data && result.data.rankings;
    });

    //REST Init
    this.RESTInit();
    
  }

  RESTInit(){
    this.httpClient.get('http://localhost:3000/rankings').subscribe((res) => {
      this.rRankings = res;

      for(let index = 0; index < this.rRankings.length - 1; index++){
        let player = this.rRankings[index].player;
        this.httpClient.get('http://localhost:3000/player?id=' + player).subscribe((res) => {
          this.rRankings[index].playerinfo = res;
          console.log(res)
        })
      }

    });

    
    
}

}


