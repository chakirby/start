# These are the controllers for your ajax api.


def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])


def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    print "Made it to the get posts api"
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    posts = []
    has_more = False

    rows = db().select(db.post.ALL, orderby=~db.post.post_duedate, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        #print r
        name = get_user_name_from_email(r.user_email)
        if i < end_idx - start_idx:
            t = dict(
                id=r.id,
                user_email=r.user_email,
                content=r.post_content,
                selected=r.post_selected,
                created_on=r.created_on,
                updated_on=r.updated_on,
                poster_name=name,
                course_from=r.course_from,
                duedate=r.post_duedate

            )
            posts.append(t)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
        has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    user_email = auth.user.email or None
    p_id = db.post.insert(post_content=request.vars.content, post_selected=request.vars.selected, post_duedate=request.vars.duedate, course_from=request.vars.course_from)
    p = db.post(p_id)
    name = get_user_name_from_email(p.user_email)
    post = dict(
            id=p.id,
            user_email=p.user_email,
            content=p.post_content,
            selected=p.post_selected,
            created_on=p.created_on,
            updated_on=p.updated_on,
            poster_name=name,
            course_from=p.course_from,
            duedate=p.post_duedate
    )
    print p
    return response.json(dict(post=post))


@auth.requires_signature()
def edit_post():
    post = db(db.post.id == request.vars.id).select().first()
    post.update_record(post_content=request.vars.post_content, post_selected=request.vars.selected, post_duedate=request.vars.duedate, course_from=request.vars.course_from)

    print post
    return dict()


@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    # Implement me!
    db(db.post.id == request.vars.post_id).delete()
    return "ok"

def get_courses():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    courses = []

    rows = db().select(db.course.ALL, orderby=db.course.course_content)# limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        print r
        #name = get_user_name_from_email(r.user_email)
        #if i < end_idx - start_idx: #this is kind of redundant since we don't want to limit
        t = dict(
            id=r.id,
            user_email=r.user_email,
            content=r.course_content
        )
        courses.append(t)
    logged_in = auth.user_id is not None
    return response.json(dict(
        courses=courses,
        logged_in=logged_in,
    ))

@auth.requires_signature()
def add_course():
    user_email = auth.user.email or None
    c_id = db.course.insert(course_content=request.vars.content)
    c = db.course(c_id)
    name = get_user_name_from_email(c.user_email)
    course = dict(
            id=c.id,
            user_email=c.user_email,
            content=c.course_content
    )
    print c
    return response.json(dict(course=course))
    
@auth.requires_signature()
def del_class():
    """Used to delete a course."""
    # Implement me!
    #course = db(db.course.id == request.vars.id).select().first()
    #course.update_record(user_email=request.vars.user_email)
    #response.flash=T("Deleted " + str(request.vars.course_id))
    db(db.course.id == request.vars.course_id).delete()
    return "ok"