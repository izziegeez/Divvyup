# DivvyUp: Divide Expenses with Friends
- (Full-stack NodeJS Web Application) 		
## General Instruction
- Implemented an expense splitting service like Splitwise that allows real-time balance update when new attendees join to contribute to the cost of goods, and helps distribute the responsibility of reimbursement among the group. 
- Frontend: an interactive web page with `AJAX` technology implemented with `React`, `HTML`, `CSS` ,`Bootstrap`, `JavaScript`. The Divvyup Website realizes four main functions:
   * **Host** a party: user is prompted to enter a Party name and Party Cost
   * **Join** a party: user is prompted to enter the Party ID and input contribution amount
   * **End** a party: causes user's balance to be updated and displays how much they still need to pay
   * **Account Page**: Displays user's previous party history i.e. party name and amount due per party and a list of active parties that the user is currently in with party name and ID
- Backend: Designed `database schemas` to store users’ name, profile pictures, balances and password, with parties’ name, cost and attendees in `MongoDB`.
  *	Used `AJAX` to `GET` users’ previous and active parties and `POST` to update balances for all attendees.
  * Used `Socket.io` to enable real-time event-based communication for join / end / leave event, attendee change and item additions
  * Encrypted user passwords with `Bcrypt` to ensure database security.
  *  Deploy website server on `Amazon EC2`: http://divvy-react.s3-website.us-east-2.amazonaws.com/

## Infrastructure Design
- 3-tier architecture
   * Presentation tier: React,HTML, CSS, Bootstrap, JavaScript
   * Data tier: MongoDB
   * Logic tier: Java
- Local and remote development environment

![Divvyup Website Workflow](http://i.imgur.com/LvDX7h7.png)
> Divvyup Website Workflow

## API Design
- Logic tier(Java Servlet to RPC)
   * Search
      * searchItems
      * Ticketmaster API
      * parse and clean data, saveItems
      * return response
   * History
      * get, set, delete favorite items
      * query database
      * return response
   * Recommendation
      * recommendItems
      * get favorite history
      * search similar events, sorting
      * return response
   * Login
      * GET: check if the session is logged in
      * POST: verify the user name and password, set session time and marked as logged in
      * query database to verify
      * return response
   * Logout
      * GET: invalid the session if exists and redirect to `index.html`
      * POST: the same as GET
      * return response
   * Register
      * Set a new user into users table/collection in database
      * return response

![APIs design](https://raw.githubusercontent.com/Wangxh329/EventRecommendation/master/img_font_icon_sources/doc/APIs.png)
> APIs design in logic tier

- TicketMasterAPI
[Official Doc - Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- Recommendation Algorithms design
   * **Content-based Recommendation**: find categories from item profile from a user’s favorite, and recommend the similar items with same categories.
   * Present recommended items with ranking based on distance (geolocation of users)

![recommendation algorithm](https://raw.githubusercontent.com/Wangxh329/EventRecommendation/master/img_font_icon_sources/doc/recommendation.png)
> Process of recommend request

## Database Design
- MySQL
   * **users** - store user information.
   * **items** - store item information.
   * **category** - store item-category relationship
   * **history** - store user favorite history

![mysql](https://raw.githubusercontent.com/Wangxh329/EventRecommendation/master/img_font_icon_sources/doc/mysql.png)
> MySQL database design

- MongoDB
   * **users** - store user information and favorite history. = (users + history)
   * **items** - store item information and item-category relationship. = (items + category)
   * **logs** – store log information

## Implementation Details
- Design pattern
   * **Builder pattern**: `Item.java`
      * When convert events from TicketMasterAPI to java Items, use builder pattern to freely add fields.
   * **Factory pattern**: `ExternalAPIFactory.java`, `DBConnectionFactory.java`
      * `ExternalAPIFactory.java`: support multiple function like recommendation of event, restaurant, news, jobs… just link to different public API like TicketMasterAPI. Improve extension ability.
      * `DBConnectionFactory.java`: support multiple database like MySQL and MongoDB. Improve extension ability.
   * **Singleton pattern**: `MySQLConnection.java`, `MongoDBConnection.java`
      * Only create specific number of instance of database, and the class can control the instance itself, and give the global access to outerclass

## User Behavior Analysis
- Online (**ElasticSearch**, **Logstash**, **Kibana**)
   * Use Logstash to fetch log (in NoSQL-like form), then store data in ElasticSearch, finally use Kibana to analyze the data in ElasticSearch, getting some tables and graphs like APIs use, request status, geolocation of visitors, etc

![ELK analysis](https://raw.githubusercontent.com/Wangxh329/EventRecommendation/master/img_font_icon_sources/doc/elk.png)
> Remote development environment

- Offline (**MapReduce in MongoDB**)
   * Copy-paste some logs from Tomcat server
   * Purify log data and store in MongoDB
   * Do ``mapreduce()`` in MongoDB
   * Get a list of timebucket-count in descending order of count, then find the peak time of website traffic

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

