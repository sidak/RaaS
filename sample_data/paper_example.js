var data = [
				{ 
					name:"meta",						
					root:"a",
					//numServices:7,
					//serviceNames:["a","b1","b2","c1","c2","c3","c4"]					
				},
				{
					"name":"a",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[5,4],
					"consumer_relevance":[4,5],
					"consumer_feedback_count":2,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[{"name":"b1","wt":0.5},{"name":"b2","wt":0.5}],
					"parent":[]
					//"siblings":[]
		
				
				},
				{
					"name":"b1",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[2,3,3],
					"consumer_relevance":[4,5,4],
					"consumer_feedback_count":3,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[{"name":"c1","wt":0.6},{"name":"c2","wt":0.4}],
					"parent":["a"]
					//"siblings":["b2"]
				
				},
				{	
					"name":"b2",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[5],
					"consumer_relevance":[5],
					"consumer_feedback_count":1,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[{"name":"c3","wt":0.3},{"name":"c4","wt":0.7}],
					"parent":["a"]
					//"siblings":["b1"]
				
				},	
				{
					"name":"c1",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[4,4,5,3],
					"consumer_relevance":[5,3,4,3],
					"consumer_feedback_count":4,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[],
					"parent":["b1"]
					//"siblings":["c2"]
	
				
				},
				{					
					"name":"c2",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[3,2,3],
					"consumer_relevance":[4,2,3],
					"consumer_feedback_count":3,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[],
					"parent":["b1"]
					//"siblings":["c1"]
		
				
				},
				{
					"name":"c3",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[4,4],
					"consumer_relevance":[4,5],
					"consumer_feedback_count":2,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[],
					"parent":["b2"]
					//"siblings":["c4"]
		
				
				},
				{
					"name":"c4",
					"agg_rating_score":-1,
					"own_rating_cont":-1,
					"children_rating_cont":-1,
					"own_wmean_rating":-1,						
					"universe_wmean_rating":-1,
					"consumer_ratings":[5,5,4],
					"consumer_relevance":[4,5,4],
					"consumer_feedback_count":3,
					"rating_trust_value":-1,
					"trust_votes":-1,
					"children":[],
					"parent":["b2"]
					//"siblings":["c3"]
			
					
				}
					
				
			];
module.exports=data;
