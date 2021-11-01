const { Schema, model } = require('mongoose');
const { format } = require('date-fns');

const announcementSchema = new Schema({
	section: { type: Schema.Types.ObjectId, ref: 'Section' },
	title: { type: String, required: true },
	description: { type: String },
	date: { type: String },
}, { timestamps: true });

announcementSchema.pre('save', function () {
	if (!this.date) {
		this.date = format(Date.now(), "dd/MM/yyyy p");
	}
});

const Announcement = model('Announcement', announcementSchema);

module.exports = { Announcement };