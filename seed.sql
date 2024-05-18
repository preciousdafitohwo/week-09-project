CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    clerk_id TEXT,
    username TEXT,
    bio TEXT
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    profile_id INT REFERENCES profiles(id),
    content TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id),
    profile_id INT REFERENCES profiles(id),
    content TEXT
);

CREATE TABLE IF NOT EXISTS post_likes (
    profile_id INT REFERENCES profiles(id),
    post_id INT REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INT REFERENCES profiles(id),
    followee_id INT REFERENCES profile_id(id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    profile_id INT REFERENCES profiles(id),
    comment_id INT REFERENCES comments(id)
);