# BeatMe API Documentation

Complete REST API documentation for BeatMe backend.

## Base URL

**Development:** `http://localhost:5000/api`
**Production:** `https://beatme-api.vercel.app/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <access_token>
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

## Authentication Endpoints

### Register

**POST** `/auth/register`

Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "username",
  "fullName": "Full Name"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "fullName": "Full Name",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login

**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Google OAuth

**GET** `/auth/google`

Initiate Google OAuth login.

### Google OAuth Callback

**GET** `/auth/google/callback?code=<code>`

Handle Google OAuth callback.

### GitHub OAuth

**GET** `/auth/github`

Initiate GitHub OAuth login.

### GitHub OAuth Callback

**GET** `/auth/github/callback?code=<code>`

Handle GitHub OAuth callback.

### Refresh Token

**POST** `/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### Logout

**POST** `/auth/logout`

Logout and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Endpoints

### Get Current User

**GET** `/users/me`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "fullName": "Full Name",
    "avatarUrl": "https://...",
    "bio": "My bio",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile

**PUT** `/users/me`

Update current user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "username": "newusername",
  "fullName": "New Full Name",
  "bio": "New bio"
}
```

**Response (200):** Updated user object

### Get User Profile

**GET** `/users/:userId`

Get a user's public profile.

**Response (200):** User object

## Songs Endpoints

### Search Songs

**GET** `/songs/search?q=<query>`

Search for songs by title, artist, or album.

**Query Parameters:**
- `q` (required) - Search query
- `limit` (optional, default: 20) - Number of results
- `offset` (optional, default: 0) - Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "song-id",
        "title": "Song Title",
        "artist": {
          "id": "artist-id",
          "name": "Artist Name"
        },
        "album": {
          "id": "album-id",
          "title": "Album Title",
          "imageUrl": "https://..."
        },
        "durationMs": 180000,
        "previewUrl": "https://..."
      }
    ],
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Song Details

**GET** `/songs/:songId`

Get detailed information about a song.

**Response (200):** Song object with artist and album details

## Playlist Endpoints

### Create Playlist

**POST** `/playlists`

Create a new playlist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "My Playlist",
  "description": "My favorite songs",
  "isPublic": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "playlist-id",
    "title": "My Playlist",
    "description": "My favorite songs",
    "isPublic": false,
    "imageUrl": null,
    "userId": "user-id",
    "songCount": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get User's Playlists

**GET** `/playlists`

Get current user's playlists.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "playlist-id",
      "title": "My Playlist",
      "songCount": 5,
      "imageUrl": null
    }
  ]
}
```

### Get Playlist Details

**GET** `/playlists/:playlistId`

Get playlist with all songs.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "playlist-id",
    "title": "My Playlist",
    "description": "My favorite songs",
    "isPublic": false,
    "userId": "user-id",
    "songs": [
      {
        "id": "song-id",
        "title": "Song Title",
        "artist": {"id": "artist-id", "name": "Artist"}
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Add Song to Playlist

**POST** `/playlists/:playlistId/songs`

Add a song to a playlist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "songId": "song-id"
}
```

**Response (201):** Updated playlist

### Remove Song from Playlist

**DELETE** `/playlists/:playlistId/songs/:songId`

Remove a song from a playlist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Song removed from playlist"
}
```

### Update Playlist

**PUT** `/playlists/:playlistId`

Update playlist details.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isPublic": true
}
```

**Response (200):** Updated playlist

### Delete Playlist

**DELETE** `/playlists/:playlistId`

Delete a playlist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Playlist deleted"
}
```

## Favorites Endpoints

### Add to Favorites

**POST** `/favorites`

Add a song to user's favorites.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "songId": "song-id"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Added to favorites"
}
```

### Get Favorites

**GET** `/favorites`

Get user's favorite songs.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional, default: 20)
- `offset` (optional, default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "songs": [
      {
        "id": "song-id",
        "title": "Song Title",
        "artist": {"id": "artist-id", "name": "Artist"}
      }
    ],
    "total": 50
  }
}
```

### Remove from Favorites

**DELETE** `/favorites/:songId`

Remove a song from favorites.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

## Listening History Endpoints

### Get Listening History

**GET** `/history`

Get user's listening history.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "history-id",
        "song": {"id": "song-id", "title": "Song Title"},
        "playedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "total": 1000
  }
}
```

### Add to History

**POST** `/history`

Log a song as played.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "songId": "song-id",
  "durationPlayedMs": 180000
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Added to listening history"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to:
- **Authenticated users:** 1000 requests per hour
- **Unauthenticated:** 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```
