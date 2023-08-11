# ENDPOINTS

| PATH       | METHOD | BODY                                                              | PARAMS | QUERY |
|------------|--------|-------------------------------------------------------------------|--------|-------|
| /posts     | GET    | none                                                              | none   | none  |
| /create    | POST   | { "title": "string", "date": "unix timestamp", "text": "string" } | none   | none  |
| /delete    | DELETE | none                                                              | id     | none  |
| /byid      | GET    | none                                                              | id     | none  |