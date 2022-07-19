import {
  AthenaFirewallMetadataModel,
  AthenaFirewallModel,
} from "../model/athena-firewall.model";
import { AthenaServicePolicyModel } from "../model/athena-service-policy.model";

export class PostmanCollectionBuilder {
  constructor(private collection: any) {}

  initCollection() {
    this.collection.info = {
      name: "Athena -- API Token Auth",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    };

    this.collection.variables = [
      {
        id: "NAMESPACE",
        value: "default",
        type: "default",
      },
      {
        id: "API_TOKEN",
        value: "",
        type: "default",
      },
      {
        id: "HOST",
        value: "playground.staging.volterra.us",
        type: "default",
      },
    ];
  }

  callServicePolicyCreate(servicePolicyObject: AthenaServicePolicyModel) {
    if (!this.collection.items) this.collection.items = [];
    this.collection.items.push({
      id: `service-policy-${servicePolicyObject.metadata.name}`,
      name: `Create Service Policy [${servicePolicyObject.metadata.name}]`,
      request: {
        url: {
          raw: "https://{{HOST}}/api/config/namespaces/{{NAMESPACE}}/service_policys",
          protocol: "https",
          host: ["{{HOST}}"],
          path: [
            "api",
            "config",
            "namespaces",
            "{{NAMESPACE}}",
            "service_policys",
          ]
        },
        method: "POST",
        body: {
          mode: "raw",
          raw: JSON.stringify(
            servicePolicyObject
          ),
          options: {
            raw: {
              language: "json",
            },
          }
        },
        header: [
          {
            key: "Authorization",
            value: "APIToken {{API_TOKEN}}",
            type: "default",
          },
        ],
      }
    });
  }

  callFirewallCreate(
    createObject: AthenaFirewallModel,
    metadata: AthenaFirewallMetadataModel
  ) {
    if (!this.collection.items) this.collection.items = [];

    this.collection.items.push({
      id: "firewall-create-token",
      name: "Create Firewall",
      request: {
        url: {
          raw: "https://{{HOST}}/api/config/namespaces/{{NAMESPACE}}/app_firewalls",
          protocol: "https",
          host: ["{{HOST}}"],
          path: [
            "api",
            "config",
            "namespaces",
            "{{NAMESPACE}}",
            "app_firewalls",
          ],
        },
        method: "POST",
        body: {
          mode: "raw",
          raw: JSON.stringify(
            {
              metadata: metadata,
              spec: createObject,
            },
            null,
            2
          ),
          options: {
            raw: {
              language: "json",
            },
          },
        },
        header: [
          {
            key: "Authorization",
            value: "APIToken {{API_TOKEN}}",
            type: "default",
          },
        ],
      },
    });
  }
}