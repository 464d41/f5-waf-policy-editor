import { get as _get, set as _set } from "lodash";
import { BaseVisitor } from "../interface/base.visitor";
import { FieldResolverVisitor } from "../interface/field-resolver.visitor";
import { FieldFactoryVisitor } from "../interface/field-factory.visitor";
import { GridFieldValue } from "../../../../component/policy-editor/controls/grid.field-value.control";
import { policyEditorJsonVisit } from "../../policy-editor.actions";
import { defaultGeneralSettings } from "../../../../model/policy-editor.defaults.model";
import { TextEditFieldControl } from "../../../../component/policy-editor/controls/field-control/text-edit.field-control";

export class GeneralSettingsVisitor
  extends BaseVisitor
  implements FieldResolverVisitor, FieldFactoryVisitor<void>
{
  getRows(): GridFieldValue[] {
    return [
      {
        title: "Policy Name",
        controlInfo: new TextEditFieldControl(
          _get(this.json, "policy.name"),
          (text) =>
            this.dispatch(
              policyEditorJsonVisit((currentJson) =>
                _set(currentJson, "policy.name", text)
              )
            )
        ),
      },
      {
        title: "Application Language",
        controlInfo: new TextEditFieldControl(
          _get(this.json, "policy.applicationLanguage"),
          (text) =>
            this.dispatch(
              policyEditorJsonVisit((currentJson) =>
                _set(currentJson, "policy.applicationLanguage", text)
              )
            )
        ),
      },
      {
        title: "Enforcement Mode",
        controlInfo: new TextEditFieldControl(
          _get(this.json, "policy.enforcementMode"),
          (text) =>
            this.dispatch(
              policyEditorJsonVisit((currentJson) =>
                _set(currentJson, "policy.enforcementMode", text)
              )
            )
        ),
      },
      {
        title: "Template",
        controlInfo: new TextEditFieldControl(
          _get(this.json, "policy.template.name"),
          (text) =>
            this.dispatch(
              policyEditorJsonVisit((currentJson) =>
                _set(currentJson, "policy.template.name", text)
              )
            )
        ),
      },
    ];
  }

  create() {
    this.dispatch(
      policyEditorJsonVisit((currentJson) => {
        _set(currentJson, "policy", defaultGeneralSettings);
      })
    );
  }

  remove(): void {}
}
