// https://www.evolu.dev/docs/local-first?platform=Vue
// https://github.com/evoluhq/evolu/blob/main/examples/vue-vite-pwa/src/App.vue
// https://deepwiki.com/search/afaik-evolu-handle-sync-using_d7178b5e-5f34-42e6-a603-f4fc02d00bad?mode=fast

// import { SimpleName, createEvolu } from "@evolu/common";
// import { provideEvolu, useQuery } from "@evolu/vue";
// import { evoluWebDeps } from "@evolu/web";

// import { EvoluDBSchema } from "@noties/shared-schema";

// const evolu = createEvolu(evoluWebDeps)(EvoluDBSchema, {
//   name: SimpleName.orThrow("family-tree-nuxt"),
// });

// provideEvolu(evolu);

// const humanPersonSimple = evolu.createQuery((db) =>
//   db.selectFrom("simple").select(["name", "gender", "isAccent"]).where("isDeleted", "is not", 1).orderBy("createdAt"),
// );

// const allPeopleSimple = useQuery(humanPersonSimple);

// console.log("allPeopleSimple", allPeopleSimple);

// // const todosWithCategories = evolu.createQuery((db) =>
// //   db
// //     .selectFrom("todo")
// //     .select(["id", "title", "isCompleted", "categoryId", "priority"])
// //     .where("isDeleted", "is not", 1)
// //     .where("title", "is not", null)
// //     .$narrowType<{ title: kysely.NotNull }>()
// //     .orderBy("createdAt"),
// // );

// // const allTodos = useQuery(todosWithCategories);

// // const { insert, update } = evolu;

// // const customPrompt = <
// //   Type extends typeof NonEmptyString1000 | typeof NonEmptyString50,
// // >(
// //   type: Type,
// //   message: string,
// //   onSuccess: (value: InferType<Type>) => void,
// // ): void => {
// //   const value = window.prompt(message);
// //   if (value == null) return;

// //   const result = type.from(value);
// //   if (!result.ok) {
// //     alert(formatTypeError(result.error));
// //     return;
// //   }
// //   onSuccess(result.value as never);
// // };

// // const createNewTodo = () => {
// //   customPrompt(NonEmptyString1000, "New Todo", (title) => {
// //     insert("todo", { title, priority: "low" });
// //   });
// // };

// // const handleUpdateCategory = (id: TodoId, categoryId: TodoCategoryIdType) => {
// //   update("todo", { id, categoryId });
// // };

// // const handleUpdatePriority = (id: TodoId, priority: TodoPriority) => {
// //   update("todo", { id, priority });
// // };

// // const handleToggleCompletedClick = (id: TodoId, isCompleted: boolean) => {
// //   update("todo", { id, isCompleted: Number(!isCompleted) as 0 | 1 });
// // };

// // const handleRenameTodoClick = (id: TodoId) => {
// //   customPrompt(NonEmptyString1000, "New Name", (title) => {
// //     update("todo", { id, title });
// //   });
// // };

// // const handleDeleteTodoClick = (id: TodoId) => {
// //   update("todo", { id, isDeleted: sqliteTrue });
// // };

// // function onCategoryChange(event: Event, id: TodoId) {
// //   if (!(event.target instanceof HTMLSelectElement)) return;

// //   handleUpdateCategory(id, event.target.value as unknown as TodoCategoryIdType);
// // }

// // function onPriorityChange(event: Event, id: TodoId) {
// //   if (!(event.target instanceof HTMLSelectElement)) return;

// //   handleUpdatePriority(id, event.target.value as unknown as TodoPriority);
// // }
