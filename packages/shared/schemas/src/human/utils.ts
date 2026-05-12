import * as v from "valibot";

import { Schema as FamilyTreeFormSchema } from "./family-tree/form";
import { Schema as FamilyTreeSchema } from "./family-tree/schemas";
import { DEFAULT_KINDS, DefaultKindSchema, KINDS, KindSchema, Schema, WithMetaSchema } from "./schemas";
import { Schema as SimpleFormSchema } from "./simple/form";
import { Schema as SimpleSchema } from "./simple/schemas";

type PersonKind = DefaultKindSchema | KindSchema;

type SchemaMap = {
  [DEFAULT_KINDS.Default]: Schema;
  [DEFAULT_KINDS.WithMeta]: WithMetaSchema;
  [KINDS.Simple]: SimpleSchema;
  [KINDS.FamilyTree]: FamilyTreeSchema;
};

/**
 * schema registry
 */
const schemas = {
  [DEFAULT_KINDS.Default]: Schema,
  [DEFAULT_KINDS.WithMeta]: WithMetaSchema,

  [KINDS.Simple]: SimpleSchema,
  [KINDS.FamilyTree]: FamilyTreeSchema,
} satisfies { [K in PersonKind]: v.BaseSchema<unknown, SchemaMap[K], v.BaseIssue<unknown>> };

export function parsePerson<K extends PersonKind>(kind: K, input: unknown): SchemaMap[K] {
  return v.parse(schemas[kind], input) as SchemaMap[K];
}

export function parsePeople<K extends PersonKind>(kind: K, input: unknown): SchemaMap[K][] {
  return v.parse(v.array(schemas[kind]), input) as SchemaMap[K][];
}

/**
 * form schema -> schema converters
 */
type FormSchemaMap = {
  [DEFAULT_KINDS.Default]: Schema;
  [DEFAULT_KINDS.WithMeta]: WithMetaSchema;
  [KINDS.Simple]: SimpleFormSchema;
  [KINDS.FamilyTree]: FamilyTreeFormSchema;
};

const formToSchemaMappers = {
  [DEFAULT_KINDS.Default]: (input: Schema): Schema => input,

  [DEFAULT_KINDS.WithMeta]: (input: WithMetaSchema): WithMetaSchema => input,

  [KINDS.Simple]: (input: SimpleFormSchema): SimpleSchema => {
    const { children, ...rest } = input;

    return {
      ...rest,

      childrenIds: children,

      meta: { kind: KINDS.Simple },
    };
  },

  [KINDS.FamilyTree]: (input: FamilyTreeFormSchema): FamilyTreeSchema => {
    const { parent, partners, children, life_span, ...rest } = input;

    return {
      ...rest,

      dateOfBirth: life_span?.[0] ? new Date(life_span[0]).toISOString() : null,
      dateOfDeath: life_span?.[1] ? new Date(life_span[1]).toISOString() : null,

      parentIds: parent,
      partnerIds: partners,
      childrenIds: children,

      meta: { kind: KINDS.FamilyTree, partnerId: partners?.[0] },
    };
  },
} satisfies { [K in PersonKind]: (input: FormSchemaMap[K]) => SchemaMap[K] };

export function formToSchema<K extends PersonKind>(kind: K, input: FormSchemaMap[K]): SchemaMap[K] {
  return formToSchemaMappers[kind](input as never) as SchemaMap[K];
}

export function bulkFormToSchema<K extends PersonKind>(kind: K, inputs: FormSchemaMap[K][]): SchemaMap[K][] {
  return inputs.map((input) => formToSchema(kind, input));
}

/**
 * schema -> form schema converters
 */
const schemaToFormMappers = {
  [DEFAULT_KINDS.Default]: (input: Schema): Schema => input,

  [DEFAULT_KINDS.WithMeta]: (input: WithMetaSchema): WithMetaSchema => input,

  [KINDS.Simple]: (input: SimpleSchema): SimpleFormSchema => {
    const { meta: _meta, childrenIds, ...rest } = input;
    return { ...rest, children: childrenIds };
  },

  [KINDS.FamilyTree]: (input: FamilyTreeSchema): FamilyTreeFormSchema => {
    const { meta: _meta, dateOfBirth, dateOfDeath, parentIds, partnerIds, childrenIds, ...rest } = input;
    return {
      ...rest,
      life_span: dateOfBirth ? (dateOfDeath ? [dateOfBirth, dateOfDeath] : [dateOfBirth]) : [],

      parent: parentIds,
      partners: partnerIds,
      children: childrenIds,
    };
  },
} satisfies { [K in PersonKind]: (input: SchemaMap[K]) => FormSchemaMap[K] };

export function schemaToFormSchema<K extends PersonKind>(kind: K, input: SchemaMap[K]): FormSchemaMap[K] {
  return schemaToFormMappers[kind](input as never) as FormSchemaMap[K];
}

export function bulkSchemaToFormSchema<K extends PersonKind>(kind: K, inputs: SchemaMap[K][]): FormSchemaMap[K][] {
  return inputs.map((input) => schemaToFormSchema(kind, input));
}
