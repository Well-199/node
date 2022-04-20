#### Adicionando novo anúncio (3/3)

# users
+ id
+ name
+ email
+ state
+ passwordHash
+ token

# states
+ id
+ name

# categories
+ id
+ name
+ slug

# ads
+ id
+ idUser
+ state
+ category
+ images [{url, default: true}]
+ dateCreated
+ title
+ price
+ priceNegotiable: true
+ description
+ views
+ status
