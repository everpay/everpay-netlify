---
layout: post
title:  "Why Stashboard and Pingdom Aren't Enough"
date:   2017-04-26 10:22:04
author: Jareau Wade
author_bio: is a co-founder and head of growth at Everpay. Before that, he was the 1st employee and head of data acquisition at Milo.com where he Managed 60% of Milo's employees and designed many of their data acquisition systems. Jareau holds a BSE in Electrical Engineering from University of Pennsylvania where he built emergency personnel tracking systems using GPS.
author_image: /img/authors/jareau_wade.png
image: /img/blogimages/2013-05-13.jpg
cover_image: /img/blogimages/2013-05-13-cover.jpg
categories: everpay update
tags: 
- payments_space
---

TL;DR
* [Everpay status page](https://status.everpayinc.com)
* [Source on GitHub](https://github.com/everpay/status.everpayinc.com)
* [Install instructions](https://github.com/everpay/status.everpayinc.com/blob/master/INSTALL)
* [Picture of kittens](http://x66.xanga.com/598b827a5233247895732/b32225086.gif)

Roughly 3 months ago and after some unexpected downtime, our community [asked us](https://github.com/everpay/everpay-api/issues/9) for more insight into the state of our API. We quickly pushed out an MVP using [Stashboard](http://www.stashboard.org/), given our people-pleasing nature, but, quickly discovered that it didn't give the granularity or accuracy we needed.
<!--break-->
### El Problem

We sat down and brainstormed what was need to accurately reflect the state of the system to satisfy customers:

* We provide 3 distinct services that our customers interact with, so we should show the uptime of each of these services separately.
* Everpay is distributed -- so, we must reflect what parts of our system are up or down while other parts are operating normally, therefore, there is no absolute up/down state.
* Everyone in the company needs to be able to communicate issues, but, if something goes wrong in the middle of the night the status page should automatically announce this.
* The status page should also show the history of incidents in addition to the uptime percentage.
* Customers want notifications pushed to them, so there needs to be some way for them to subscribe.
* It's almost 2013, we want real-time stats!
* At the time Everpay had 8 employees, 5 of them were engineers, -1 of them had time to build the system.

### Quick, someone copy and paste a solution

Everyone knows the quickest way to solve a problem is to piggyback on someone else's hard work and started exploring the existing commercial and open source products in the wild:

#### Stashboard

  [Stashboard](http://www.stashboard.org/) was the go to. It looks reasonable out of the box, it's widely supported, it takes about 10 seconds to setup. We had stashboard up and running and added our 3 services. 100% uptime ensued. The problem was that we _didn't_ have—100% uptime. Nobody (us included) believed the status page, which made it useless. Clearly, health checks are insufficient in this case.

#### Pingdom

  [Pingdom](https://pingdom.com) provides one of the best commercial offerings that we've seen—great UI, runs on all devices and pushes notifications to you, so we spun up a trial account in parallel with stashboard and watched how it went. We got 99.999% uptime, but again, this wasn't accurate. Another shortcoming was we want to health checks that included `POST` or `PUT` requests. We could have written a script and mounted it to a URL and map all requests to a `GET` to get it to run. That's reasonable, but it still doesn't accurately reflect all requests flowing through Everpay.

After looking at a couple other offerings, it became clear that an external system wouldn't have the level of access to our internal system, there was nothing else for it, someone was going to have to write some code and that someone was me.

One discovery we did make while evaluating external services was that a simple health check is not sufficient. These services provided uptime monitoring, what we wanted was _availability_. Essentially, if Everpay serves 100 requests and one request fails then the uptime we want to show is 99%. Time calculations break down if you're up when there are no requests but down during a spike.

### No solution in sight, a brave code warrior enters the arena

Quickly, pausing only for coffee, hummus, and a tasty bread covered morsel, with only a MacBook Pro and a standing desk for company, I bravely created an empty git repo...

#### AWS

Like all good engineers, I took the chance to try something new. We run on AWS and AWS has infrastructure tools out the arse, so let's leverage that. A quick Google search revealed that AWS load balancers (ELBs) have a [CloudWatch API](http://docs.amazonwebservices.com/ElasticLoadBalancing/latest/DeveloperGuide/US_MonitoringLoadBalancerWithCW.html) that returns HTTP status codes grouped by the most significant digit. Great. All I needed to do was sum the number of 2xx, 3xx, 4xx, and 5xx requests, figure out the percentage of these that were in the 5xx class, put a fork in it, and we're done. ELBs are like gifts from the gods, for the 99% of things you need they do them better than you ever could. Hit that 1% issue and you're at the mercy of the AWS infra team. I [begged and pleaded](https://forums.aws.amazon.com/message.jspa?messageID=377157#377157) on the AWS forums, the days ticked past and the CEO stood at my shoulder demanding stats for the hordes of customers banging at our digital walls. Not being one who gives up, I gave up and moved on.

#### Good developers build, great designers steal

In the meantime, our designer, Richard, began scouring the web for inspiration. After checking out some amazing designs we found [Heroku's status page](https://status.heroku.com/) and [whipped up a mock](https://github.com/balanced/balanced-api/issues/12) based on that. We quickly built our a static HTML version and then sat down to figure out how to get information into the app.

Internally, we've both leveraged and built a slew of tools. All I needed to do was pick and choose from the right tools and write some glue to string everything together. Since we couldn't get the HTTP status codes from the ELB we dropped down a level and decided to parse the NGINX logs. These almost always correspond with the actual status code the user got so we consider them our authoritative source for deciding if a request succeeded. We already log these to a centralized server using [RSYSLOG](http://www.rsyslog.com/), so I already had a data source to draw from. Next, I went and brewed a fresh pot of coffee and bestowed it upon [bninja](https://github.com/bninja) for his prescient work in building our log parser, [Slurp](https://github.com/bninja/slurp). We wrote a quick Slurp script that read the [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) from each request and then fed them into [Graphite](http://graphite.wikidot.com/) buckets. Each bucket was based on service name (`DASHBOARD`, `API`, `JS`) and then response code family (`2xx`, `3xx`, `4xx`, `5xx`, and a special case `timeout` for slow requests).

#### Using Twitter as infrastructure

So we had a basic uptime for each service based on all requests that go through our system. Happily I sat back, stretched and went outside to get some sunshine, but then from out of nowhere a wild [CEO](https://twitter.com/matin) appeared. Clearly, this was an unfinished solution. Yes. We have near real-time availability stats, but how does someone update the status manually? Great question. Leaving the warm California sunshine behind, we re-entered the office.

We chose Twitter because it satisfied the remaining requirements we had. Subscribe to notifications? Just follow [@everpaystatus](https://twitter.com/everpaystatus). Everyone needs to be able to update the status page? Just login to the Twitter account and use the [grammar we developed](https://github.com/everpay/status.everpayinc.com/blob/master/README.md#message-display-behavior):
> `SERVICE-STATE: MESSAGE`

> For example: `API-ISSUE: The API is currently giving out free money :-0` where `API` is the service and `ISSUE` is the state and the remainder of the tweet is the message displayed.

**Twitter would feed updates into the status page instead of the other way around.**

#### STFU and let me play with it

You too can get the status page up and running. If you want to explore the code we've released, just follow these simple steps. If you get stuck, [join one of our support channels](https://www.everpayinc.com/community) and get some help.

Before you begin, make sure you've got [Google App Engine SDK](https://developers.google.com/appengine/downloads) installed.

1. Get the code

        git clone https://github.com/everpay/status.everpayinc.com.git
        cd status.everpayinc.com

2. Run the local development server

        dev_appserver.py situation/

3. Visit [http://localhost:8000/](http://localhost:8000/) to view the page
4. To pull data from our test Twitter account, run this curl command

        curl http://localhost:8000/twitter -d update=1 -u username:password

5. If you want to deploy this to your own GAE account, edit [`app.yaml`](https://github.com/everpay/status.everpayinc.com/blob/master/situation/app.yaml#L1), change the name of the app (`situation-demo`) to your own app name and then run

        appcfg.py update situation/

If you want to use this for your own, you'll need to point it at your own graphite server and add your own Twitter app credentials into [settings.py](https://github.com/everpay/status.everpayinc.com/blob/master/situation/settings.py#L6).

Finally, you'll need to setup a cron job or some other sort of scheduled task which will `POST` to the `/twitter` and `/uptime` URLs to pull data into the system.

Thanks to the contributors of the [Tweepy library](https://github.com/tweepy/tweepy), we're using Tweepy to communicate with the Twitter API. We got inspiration from [Heroku's](https://status.heroku.com/) excellent status page implementation.

If you have suggestions for how we can improve or want to discuss please visit our [support channels](https://www.everpayinc.com/community) or post a message on the [Situation githup repo](https://github.com/everpayinc/status.everpayinc.com/issues).
