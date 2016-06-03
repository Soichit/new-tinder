// by setting package as main, Go will compile this as an executable file.
// Any other package turns this into a library
package main

// These are your imports / libraries / frameworks
import (
	// this is Go's built-in sql library
	"database/sql"
	"log"
	"net/http"
	"os"
	"strconv"

	// this allows us to run our web server
	"github.com/gin-gonic/gin"
	// this lets us connect to Postgres DB's
	_ "github.com/lib/pq"
)

var (
	// this is the pointer to the database we will be working with
	// this is a "global" variable (sorta kinda, but you can use it as such)
	db *sql.DB
)



func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

	var errd error
	// here we want to open a connection to the database using an environemnt variable.
	// This isn't the best technique, but it is the simplest one for heroku
	db, errd = sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if errd != nil {
		log.Fatalf("Error opening database: %q", errd)
	}
	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("html/*")
	router.Static("/static", "static")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/ping", func(c *gin.Context) {
		ping := db.Ping()
		if ping != nil {
			// our site can't handle http status codes, but I'll still put them in cause why not
			c.JSON(http.StatusOK, gin.H{"error": "true", "message": "db was not created. Check your DATABASE_URL"})
		} else {
			c.JSON(http.StatusOK, gin.H{"error": "false", "message": "db created"})
		}
	})


	router.GET("getFoodStack", func(c *gin.Context) {
    rows, err := db.Query("SELECT * FROM food")
        if err != nil {
            c.AbortWithError(http.StatusInternalServerError, err)
            return
        }
        // if you are simply inserting data you can stop here. I'd suggest returning a JSON object saying "insert successful" or something along those lines.
        // get all the columns. You can do something with them here if you like, such as adding them to a table header, or adding them to the JSON
        cols, _ := rows.Columns()
        if len(cols) == 0 {
            c.AbortWithStatus(http.StatusNoContent)
            return
        }
    	// The variable(s) here should match your returned columns in the EXACT same order as you give them in your query
        output := make([][]string, 0)
        var id int
		var image string
		var recommended bool
		var price string
		var size int
		var spice_level int
		var food_type string
		var name string


        for rows.Next() {
            rows.Scan(&id, &image, &recommended, &price, &size, &spice_level, &food_type, &name)
            array:= []string{strconv.Itoa(id), image, name, price}
            output = append(output, array)
        }

        //Finally, return your results to the user:
    	c.JSON(http.StatusOK, gin.H{"result": output})
    })
	// NO code should go after this line. it won't ever reach that point
	router.Run(":" + port)
}

/*
Example of processing a GET request

// this will run whenever someone goes to last-first-lab7.herokuapp.com/EXAMPLE
router.GET("/EXAMPLE", func(c *gin.Context) {
    // process stuff
    // run queries
    // do math
    //decide what to return
    c.JSON(http.StatusOK, gin.H{
        "key": "value"
        }) // this returns a JSON file to the requestor
    // look at https://godoc.org/github.com/gin-gonic/gin to find other return types. JSON will be the most useful for this
})

*/
