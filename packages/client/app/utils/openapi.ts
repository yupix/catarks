import { meta as createItemMeta } from "~/routes/api/items/price"

const paths = {
  ...createItemMeta
}

export const baseSchema = {
  "openapi": "3.1.0",
  "x-stoplight": {
    "id": "prdhwla5t8n9z"
  },
  "info": {
    "title": "createItemPrice",
    "version": "1.0"
  },
  "servers": [
    {
      "url": "http://localhost:3000"
    }
  ],
  "paths": {
    "/api/items/{itemId}/price": {
      "parameters": [
        {
          "schema": {
            "type": "string"
          },
          "name": "itemId",
          "in": "path",
          "required": true
        }
      ],
      "post": {
        "summary": "",
        "operationId": "post-api-items-itemId-price",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Item"
                }
              }
            }
          }
        },
        "description": "",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "price": {
                    "type": "string"
                  },
                  "ship": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "parameters": []
      }
    },
    "/api/items": {
      "get": {
        "summary": "Your GET endpoint",
        "tags": [],
        "responses": {},
        "operationId": "get-api-items",
        "parameters": [
          {
            "schema": {
              "type": "string",
              "enum": [
                "ability",
                "weapon",
                "armor"
              ]
            },
            "in": "query",
            "name": "type",
            "description": "アイテムのカテゴリ"
          },
          {
            "schema": {
              "type": "number"
            },
            "in": "query",
            "name": "skip",
            "description": "スキップする個数"
          },
          {
            "schema": {
              "type": "number"
            },
            "in": "query",
            "name": "limit",
            "description": "最大取得数"
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "max": {
                    "type": "number"
                  },
                  "items": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Item"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "title": "User",
        "type": "object",
        "description": "",
        "examples": [
          {
            "id": 142,
            "firstName": "Alice",
            "lastName": "Smith",
            "email": "alice.smith@gmail.com",
            "dateOfBirth": "1997-10-31",
            "emailVerified": true,
            "signUpDate": "2019-08-24"
          }
        ],
        "properties": {
          "id": {
            "type": "integer",
            "description": "Unique identifier for the given user."
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "dateOfBirth": {
            "type": "string",
            "format": "date",
            "example": "1997-10-31"
          },
          "emailVerified": {
            "type": "boolean",
            "description": "Set to true if the user's email has been verified."
          },
          "createDate": {
            "type": "string",
            "format": "date",
            "description": "The date that the user was created."
          }
        },
        "required": [
          "id",
          "firstName",
          "lastName",
          "email",
          "emailVerified"
        ]
      },
      "Item": {
        "title": "Item",
        "x-stoplight": {
          "id": "qymjbm3xamvgz"
        },
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "rarity": {
            "type": "number"
          },
          "type": {
            "type": "string",
            "enum": [
              "ability",
              "weapon",
              "armor"
            ]
          },
          "abilitiesName": {
            "type": [
              "string",
              "null"
            ]
          },
          "iconUrl": {
            "type": "string"
          }
        }
      }
    }
  }
}