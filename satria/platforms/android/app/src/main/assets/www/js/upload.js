
// instal plugin filechooser
// https://www.npmjs.com/package/cordova-plugin-file-chooser
// instal plugin file transfer


//ketika klik pilih file
function pilih_file() {
	var options = {};
	filechooser.open(options, success, error);
}
//berhasil pilih file
function success(imgData){
	var pathfile = imgData.url;
	//simpan path file nya dan set value di form nya
}
//gagal pilih file
function error(msg){
	console.log(msg);
}

//ketika upload file
function upload_file(){
	//ambil path file yg tadi dipilih
	var imageURI = pathfile;
	
	var options = new FileUploadOptions();
	options.fileKey = "myfile";
	var filename =imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.fileName = filename;
	options.headers = {
		Connection: "close"
	};
	var params = new Object();
	options.params = params;
	options.chunkedMode = false;
	var ft = new FileTransfer();
	var urlUpload = server+'/'+token+'/'+laporan_id; // url webservice untuk upload
	ft.upload(imageURI, urlUpload, win, fail,options);
}
// berhasil upload
function win(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	
	var respon = JSON.parse(r.response);
	//olah hasil response disini
}

//gagal upload
function fail(error) {
	alert(error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}