import { ParseStrategyBase } from "../parse-strategy.base";
import { KeyParsingResultEnum } from "../../model/key-parsing-result.enum";
import { StrategyLogItemModel } from "../../model/strategy-log-item.model";
import { Filetype } from "../../../model/policy-schema/policy.definitions";
import { AthenaServicePolicyModel } from "../../model/athena-service-policy.model";
import { transparentBlockUtil } from "./transparent-block.util";
import { AthenaAction } from "../../model/athena-common.model";

export class FiletypesParseStrategy extends ParseStrategyBase {
  parse(policyObj: Filetype[], fullPath: string) {
    if (!policyObj) return Promise.resolve();

    if (!this.context.athenaServicePolicy["filetypes"]) {
      this.context.athenaServicePolicy["filetypes"] = {
        metadata: {
          name: "filetypes",
          namespace: "{{NAMESPACE}}",
        },
        spec: {
          algo: "FIRST_MATCH",
          any_server: {},
          simple_rules: [],
          rule_list: {
            rules: [],
          },
        },
      } as AthenaServicePolicyModel;
    }

    let hasWildcard = false;
    let wildcardBlocking: AthenaAction = AthenaAction.NEXT_POLICY;

    policyObj
      .sort((a: Filetype, b: Filetype) => {
        if (a.wildcardOrder !== undefined && b.wildcardOrder !== undefined) {
          return a.wildcardOrder - b.wildcardOrder;
        }

        return 0;
      })
      .forEach((x: Filetype) => {
        if (
          this.context.athenaServicePolicy["filetypes"].spec.rule_list?.rules
        ) {
          if (x.name === "*") {
            hasWildcard = true;
            wildcardBlocking =
              this.overrideAction ??
              transparentBlockUtil(
                x,
                !!this.context.athenaFirewallDto.blocking,
                AthenaAction.NEXT_POLICY
              );
          } else {
            const dotName = x.name.startsWith(".") ? x.name : `.${x.name}`;
            this.context.athenaServicePolicy[
              "filetypes"
            ].spec.rule_list.rules.push({
              metadata: {
                name: x.name.toLowerCase(),
              },
              spec: {
                action:
                  this.overrideAction ??
                  transparentBlockUtil(
                    x,
                    !!this.context.athenaFirewallDto.blocking,
                    AthenaAction.NEXT_POLICY
                  ),
                path: {
                  suffix_values: [dotName],
                },
                waf_action: {
                  none: {},
                },
              },
            });
          }
        }
      });

    if (
      hasWildcard &&
      this.context.athenaServicePolicy["filetypes"].spec.rule_list?.rules
    ) {
      this.context.athenaServicePolicy["filetypes"].spec.rule_list.rules.push({
        metadata: {
          name: "any",
        },
        spec: {
          action: wildcardBlocking,
          path: {
            regex_values: ["^.[w]+$"],
          },
          waf_action: {
            none: {},
          },
        },
      });
    }

    this.context.strategyLog.add(
      new StrategyLogItemModel(fullPath, KeyParsingResultEnum.success)
    );

    return Promise.resolve();
  }
}