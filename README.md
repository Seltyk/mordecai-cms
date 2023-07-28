# Mordcai Marches to Manchuria
[![Build Status](https://travis-ci.org/nolski/timemapper-cms.svg?branch=master)](https://travis-ci.org/nolski/timemapper-cms)

CMS for adding events to Time Mapper. Check out the project's [documentation](http://nolski.github.io/timemapper-cms/).

# Prerequisites
- [virtualenv](https://virtualenv.pypa.io/en/latest/)
- [postgresql](http://www.postgresql.org/)
- [redis](http://redis.io/)
- [heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- libpq, nanely the devel package for your distro (for C headers)

# Initialize the project
Create and activate a virtualenv:

```bash
virtualenv env
source env/bin/activate
```
Install dependencies:

```bash
pip install -r requirements/local.txt
```
Create the database:

```bash
createdb timemapper-cms
```
Initialize the git repository

```
git init
git remote add origin git@github.com:nolski/timemapper-cms.git
```

Migrate the database and create a superuser:
```bash
python timemapper-cms/manage.py migrate
python timemapper-cms/manage.py createsuperuser
```

Run the development server:
```bash
python timemapper-cms/manage.py runserver
```

# Create Servers
By default the included fabfile will setup three environments:

- dev -- The bleeding edge of development
- qa -- For quality assurance testing
- prod -- For the live application

Create these servers on Heroku with:

```bash
fab init
```

# Automated Deployment
Deployment is handled via Travis. When builds pass Travis will automatically deploy that branch to Heroku. Enable this with:
```bash
travis encrypt $(heroku auth:token) --add deploy.api_key
```
