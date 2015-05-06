"use strict";

 angular.module("env-config", [])

.constant("ENV", {
  "name": "production",
  "apiEndpoint": "https://groupeat.fr/api"
})

;