// This is the js for the default/index.html view.

var app = function() {

    var self = {};
    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    function get_posts_url(start_idx, end_idx) {
        console.log("I am in the get posts url method");
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }

    function get_courses_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return courses_url + "?" + $.param(pp);
    }

    self.goto = function (page) {
        self.vue.page = page;
    };

    self.get_posts = function () {
        console.log("I am in the get posts method");
        var post_len = self.vue.posts.length;
        $.getJSON(get_posts_url(post_len, post_len+50), function (data) {
            console.log(data);
            self.vue.posts = data.posts;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
        })
    };

    self.add_post_button = function () {
        // The button to add a track has been pressed.
        if(self.vue.logged_in)
          self.vue.is_adding_post = !self.vue.is_adding_post;
        self.vue.form_content = "";
        self.vue.selected=null;
    };

    self.add_post = function () {
        // The submit button to add a track has been added.
        $.post(add_post_url,
            {
                content: self.vue.form_content,
                selected: self.vue.selected,
                course_from: self.vue.course_from,
                duedate: self.vue.form_duedate
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                console.log(self.vue.posts.length);
                // if posts length is greater than 20 has_more is true.
                // Feel free to set this value to whatever seems useful!
                // (maybe eventually even allow it to be user-defined? maybe.)
                if (self.vue.posts.length > 50) {
                    self.vue.has_more = true;
                }
                self.vue.is_adding_post = !self.vue.is_adding_post;
                self.vue.form_content = "";
                self.vue.selected = 0;
            });
    };

    self.get_more = function () {
        var num_posts = self.vue.posts.length;
        $.getJSON(get_posts_url(num_posts, num_posts + 50), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
        });
    };

    self.edit_post_submit = function () {
        // The submit button to add a track has been added.
        $.post(edit_post_url,
            {
                post_content: self.vue.edit_content,
                selected: self.vue.selected,
                duedate: self.vue.edit_duedate,      
                course_from: self.vue.course_from,
                id: self.vue.edit_id
            },
            function (data) {
                $.web2py.enableElement($("#edit_post_submit"));
                self.vue.editing = !self.vue.editing;
            });
    };
    self.edit_post = function(post_id) {
        console.log("yes");
        self.vue.editing = !self.vue.editing;
        self.vue.edit_id = post_id;
        var idx = null;
            for (var i = 0; i < self.vue.posts.length; i++) {
                if (self.vue.posts[i].id === post_id) {
                    // If I set this to i, it won't work, as the if below will
                    // return false for items in first position.
                    idx = i + 1;
                    break;
                }
            }
        console.log(idx)
        //self.vue.temp = self.vue.post_content;
    };

    self.cancel_edit = function () {
        self.vue.editing = !self.vue.editing;
        self.vue.edit_id = 0;
        self.vue.post_content="";
        self.vue.please_reload = true;
        //self.vue.edit_content = self.vue.temp;
    };

    self.delete_track = function(post_id) { //lol that name though
        $.post(del_post_url,
            {
                post_id: post_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.posts.length; i++) {
                    if (self.vue.posts[i].id === post_id) {
                        // If I set this to i, it won't work, as the if below will
                        // return false for items in first position.
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.posts.splice(idx - 1, 1);

                    //if posts length is less that 5 has_more is false
                    if (self.vue.posts.length < 50) {
                        self.vue.has_more = false;
                    }
                }
            }
        )
    };

    self.get_courses = function () {
        var course_len = self.vue.courses.length;
        $.getJSON(get_courses_url(course_len, course_len+50), function (data) {
            console.log(data);
            self.vue.courses = data.courses;
            self.vue.logged_in = data.logged_in;
        })
    };

    self.edit_course_submit = function () {
        // The submit button to add a track has been added.
        $.post(edit_course_url,
            {
                course_content: self.vue.edit_content,
                id: self.vue.edit_id
            },
            function (data) {
                $.web2py.enableElement($("#edit_course_submit"));
                self.vue.editing = !self.vue.editing;
            });
    };

    self.add_course_button = function () {
        // The button to add a course has been pressed.
        if(self.vue.logged_in)
          self.vue.is_adding_course = !self.vue.is_adding_course;
        self.vue.form_content = "";
    };

    self.sadface = function(){
        alert("sad");
    };
    
    self.add_course = function () {
        // The submit button to add a track has been added.
        //console.log(self.vue.course_content)
        //self.vue.please_reload = true;//"{{=icon_warning}} Please refresh <br>";
        console.log("aaaah");
        $.post(add_course_url,
            {
                content: self.vue.course_content,
            },
            function (data) {
                $.web2py.enableElement($("#add_course_submit"));
                self.vue.courses.unshift(data.course);
                //console.log(self.vue.course.length);
                self.vue.is_adding_course = !self.vue.is_adding_course;
                self.vue.course_content = "";
            });
    };
    
    self.choose_class_button = function(course){
        console.log(course);
        self.vue.course_from = course;
    };
    
    self.delete_class = function(course_id) {
        self.vue.course_from = '';
        $.post(del_class_url,
            {
                course_id: course_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.courses.length; i++) {
                    if (self.vue.courses[i].id === course_id) {
                        // If I set this to i, it won't work, as the if below will
                        // return false for items in first position.
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.courses.splice(idx - 1, 1);

                    //if posts length is less that 5 has_more is false
                    if (self.vue.courses.length < -1) {
                        self.vue.has_more = false;
                    }
                }
            }
        )
    };
    
    self.assignment_notify = function(post){
        /*var d = new Date();
        var today = "";
        today += d.getFullYear().toString() + "-";
        today += (d.getMonth() + 1).toString();
        today += "-" + (d.getDate() - 1).toString(); //okay it's not today whatever
        console.log(today)*/
        var d = new Date();
        var duearray = post.duedate.split("-");
        var due = duearray[0]*10000+duearray[1]*100+duearray[2];
        var now = d.getFullYear()*1000000+(d.getMonth()+1)*10000+d.getDate() + 1;
        //idk why the numbers are different!
        //console.log("due " + due);
        //console.log("now " + now);
        /*for(var i=0; i<due.length; i++){
            console.log(due[i]);
        }*/
        
        if(now >= due && post.selected != "Done")
            return true;
        else return false;
    }
    

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            posts: [],
            get_more: false,
            logged_in: false,
            editing: false,
            is_adding_post: false,
            has_more: false,
            form_content: null,
            edit_content: null,
            selected: null,
            form_duedate: '',
            edit_duedate: '',
            edit_id: 0,
            show: true,
            courses: [],
            course_content: null,
            is_adding_course:false,
            course_from: '',
            choose_course: '',
            selected_course: '',
            deleted_courses: [],
            edit_selected: null,
            please_reload: false
        },
        methods: {
            goto: self.goto,
            get_more: self.get_more,
            add_post_button: self.add_post_button,
            add_post: self.add_post,
            delete_track: self.delete_track,
            edit_post: self.edit_post,
            edit_post_submit: self.edit_post_submit,
            cancel_edit: self.cancel_edit,
            add_course_button: self.add_course_button,
            add_course: self.add_course,
            choose_class_button: self.choose_class_button,
            delete_class: self.delete_class,
            assignment_notify: self.assignment_notify,
            sadface: self.sadface
        }


    });

    self.get_posts();
    self.get_courses();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});




