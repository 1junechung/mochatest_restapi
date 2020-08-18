let chai = require("chai"); // chai dependency
let chaiHttp = require("chai-http"); // chai-http dependency for...
let server = require("../index"); // actual app

//Assertion Style 

chai.should();
chai.use(chaiHttp);

describe('Tasks API', () => {
    /**
     * Test for GET 
     */
    describe("GET /api/tasks", () => {
        it("It should GET all the tasks", (done) => {
            chai.request(server)
                .get("/api/tasks") // this got into an error! without / in beginning
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eq(3);
                done();
                });
        });

        it("It should NOT GET all the tasks", (done) => {
            chai.request(server)
                .get("/api/taskwrong")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });        

    });

    /**
     * Test for GET(by id)
     */
    describe("GET /api/tasks/:id", () => {
        it("It should GET task by ID", (done) => {
            const taskId = 1; // define const out of actual test scope
            chai.request(server)
                .get("/api/tasks/" + taskId) // BE CAREFUL WHEN WRITING URI 
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(1);   
                done();
                });
        });

        it("It should NOT GET a tasks by ID", (done) => {
            const taskId = 123; // weird task id
            chai.request(server)
                .get("/api/tasks/" + taskId) // BE CAREFUL WHEN WRITING URI 
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.text.should.be.eql("The task with the provided ID does not exist.");
                done();
                });
        });        
    });

    /**
     * Test for POST
     */
    describe("POST /api/tasks", () => {
        it("It should POST a new task", (done) => {
            // define a new task object
            const task = {  
                name: "Task 4",
                completed: false
            };

            chai.request(server)
                .post("/api/tasks")  // make sure to change this to post 
                .send(task) //need to send the object in POST
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(4);
                    response.body.should.have.property('name').eq("Task 4");
                    response.body.should.have.property('completed').eq(false);                       
                done();
                });
        });

        it("It should NOT POST a new task", (done) => {
            // define a new task object
            const task = {  
                name: "Ta", // less than 3 characters(task-schema check)
                completed: false
            };

            chai.request(server)
                .post("/api/tasks")  // make sure to change this to post 
                .send(task) //need to send the object in POST
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eql("The name should be at least 3 chars long!");               
                done();
                });
        });
    });    
    /**
     * Test for PUT 
     */

    /**
     * Test for DELETE 
     */
    describe("DELETE /api/tasks/:id", () => {
        it("It should DELETE a task by id", (done) => {
            const taskId = 1;
            chai.request(server)
                .delete("/api/tasks/" + taskId)  
                .end((err, response) => {
                    response.should.have.status(200);                    
                done();
                });
        });

        it("It should NOT DELETE a task by id", (done) => {
            const taskId = 145;
            chai.request(server)
                .delete("/api/tasks/" + taskId)  
                .end((err, response) => {
                    response.should.have.status(404); 
                    response.text.should.be.eql("The task with the provided ID does not exist.");                
                done();
                });
        });
    });
});

