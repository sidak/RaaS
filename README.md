# Rating as a Service (RaaS) Architecture

##Description
This project provides a *REST API* for consumer Rating as a Service (*RaaS*) architecture, facilitating feedback aggregation in Service Ecosystem. It is written using *Node.js* and *Express* with *MongoDB* for persistance. 

*RaaS* is a building block service that can be used to add the consumer feedback lifecycle feature in the development of various web platforms.

This API was written during my research work on the topic, **Relevance calculation of reviews in Service-Oriented Architecture**. This research was carried out as a part of my **Research Internship at Purdue University, USA**. 

It is based on the general architecture proposed in the paper - R. Ranchal, A. Mohindra, N. Zhou, S. Kapoor, and B. Bhargava, "[Hierarchical Aggregation of Consumer Ratings for Service Ecosystem](http://ieeexplore.ieee.org/xpl/articleDetails.jsp?arnumber=7195617&newsearch=true&queryText=Hierarchical%20Aggregation%20of%20Consumer%20Ratings%20for%20Service%20Ecosystem)," in Proceedings of 22nd IEEE International Conference on Web Services, pp. 575-582, 2015. 

##Endpoints

###Service Resources

- `GET` services
- `GET` services/:id
- `GET` services/:id/reviews
- `POST` services
- `POST` services/:id/reviews
- `DELETE` services
- `DELETE` services/:id

###Feedback Resources

- `GET` feedback
- `GET` feedback/:id

###Init Method

- `GET` init/:fileName
- `POST` init

## Steps to get started 

- Installing MongoDB
- Installing Node and NPM
- Running the API 
- Playing with the API

### Installing MongoDB

### Installing Node and NPM

### Running the API

```
sudo service mongod start
npm rebuild
node bin/www
```
### Playing with the API

Install Postman extension. Then experiment with different GET, POST, DELETE commands

```
GET http://localhost:3000/api/init/dataFile.js
GET http://localhost:3000/api/feedback
GET http://localhost:3000/api/services
```
##Legal

If you intend to use this software, for any commercial usage, or as part of any research paper,
please contact the author for appropriate licensing.

Outside of these conditions, the software lies under the [MIT License](http://sidak.mit-license.org/).

##Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
>>>>>>> bd1ce25a9166f50ccf72b9f5de039a8aa1b358bd


