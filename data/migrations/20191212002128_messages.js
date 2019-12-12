
// exports.up = function(knex) {
//     return knex.schema
//     .createTable('messages', col => {
//         col.increments('userId')
//     })
//     .createTable('labels', col => {
//         col.increments()
//         col.string('tagger_Finance')
//         col.string('tagger_Personal')
//         col.string('tagger_Productivity')
//         col.string('tagger_Security')
//         col.string('tagger_Social')
//         col.string('tagger_Shopping')
//         col.string('tagger_Promotions')
//         col.string('tagger_Other') 
//     })
//     .create('message-Id', col => {
//         col.increments('message-Id')
//     })
// };

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('tags')
    .dropTableIfExists('messages')
};
