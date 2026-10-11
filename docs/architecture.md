# QuickNotes System Architecture

## Requirements

### Functional requirements

- Users can authenticate.
- Users can create, read, update, and delete their own notes.
- Users can organise notes with tags.
- Users can retrieve their notes through an API.

### Non-functional requirements

- Good response times for common operations.
- Secure access to private notes.
- Ability to handle increasing traffic.
- Monitoring, backup, and recovery procedures.

## Load estimates

Assumptions:

- 1,000,000 registered users.
- 20% are active each day.
- Each active user creates 5 notes daily.
- Each active user loads a notes list 20 times daily.
- Average note content and metadata use approximately 500 bytes.
- One day is rounded to 100,000 seconds for simple calculations.
- Peak traffic is five times average traffic.

Daily active users:

1,000,000 x 20% = 200,000 users.

Daily note creations:

200,000 x 5 = 1,000,000 writes.

Average writes per second:

1,000,000 / 100,000 = 10 writes per second.

Peak writes per second:

10 x 5 = 50 writes per second.

Daily list requests:

200,000 x 20 = 4,000,000 reads.

Average reads per second:

4,000,000 / 100,000 = 40 reads per second.

Peak reads per second:

40 x 5 = 200 reads per second.

Estimated new data storage:

1,000,000 x 500 bytes = 500 MB daily.

500 MB x 365 = approximately 182.5 GB yearly.

These estimates exclude indexes, backups, replication, and database overhead.
The system is read-heavy because it receives more reads than writes.

## Architecture diagram

```text
                 USERS / BROWSER
                        |
                       DNS
                        |
                 CDN: static files
                        |
                  LOAD BALANCER
                        |
              +---------+---------+
              |         |         |
              v         v         v
            APP 1     APP 2     APP 3
              |         |         |
              +---------+---------+
                        |
              +---------+---------+
              |         |         |
              v         v         v
            CACHE    PRIMARY   MESSAGE QUEUE
           (Redis)  DATABASE        |
                        |            v
                        v          WORKER
                   READ REPLICA
```

## Components

- DNS resolves the application domain to the appropriate network address.
- CDN serves static frontend assets close to users.
- Load balancer distributes requests across healthy application servers.
- Application servers validate requests and implement application rules.
- Redis cache stores frequently accessed data to reduce database load.
- Primary database handles authoritative writes.
- Read replica handles eligible reads to reduce primary database workload.
- Message queue stores jobs that can be processed asynchronously.
- Worker processes background tasks such as email notifications or exports.

## Read request flow

1. The browser requests a user's notes.
2. The load balancer selects a healthy application server.
3. The application authenticates the user and checks permissions.
4. It checks the cache for the requested data.
5. On a cache miss, it reads from the database or a suitable replica.
6. The application returns the result and may cache it.

## Write request flow

1. The browser submits a note.
2. The load balancer forwards the request to an application server.
3. The application validates the input and verifies user permissions.
4. The primary database stores the note.
5. Relevant cached data is invalidated or updated.
6. The API returns a successful response.
7. Non-critical background work can be placed in a queue.

## Trade-offs

### Speed versus freshness

Caching reduces latency and database load but can temporarily return outdated data.

### Cost versus performance

Additional application servers, replicas, and caching improve capacity but cost more.

### Simplicity versus availability

A single server is simpler to operate. Multiple servers improve resilience but require health checks, monitoring, and deployment coordination.

### Consistency versus availability

Replicas may lag behind the primary database. The application should use the primary database for operations that require the newest data.

## Reliability

Use multiple application servers, health checks, database backups, tested recovery procedures, monitoring, and alerts. Permanent data must not depend on the cache alone.
