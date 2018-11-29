<!DOCTYPE HTML>
<html>
<head>
	<title>E-SATRIA</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<link rel="stylesheet" href="<?=base_url()?>assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="<?=base_url()?>assets/css/bootstrap-responsive.min.css">
	<link rel="stylesheet" href="<?=base_url()?>assets/css/plugins/jquery-ui/smoothness/jquery-ui.css">
	<link rel="stylesheet" href="<?=base_url()?>assets/css/plugins/jquery-ui/smoothness/jquery.ui.theme.css">
	<script src="<?=base_url()?>assets/js/jquery.min.js"></script>
	<script src="<?=base_url()?>assets/js/bootstrap.min.js"></script>
	<script src="<?php echo base_url();?>assets/js/pkiwebsdk-core.js"></script>
</head>
<body style="padding:0;">
<style>
.main-frm{
	-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05); background-color: #f5f5f5; border: 1px solid #e3e3e3; border-radius: 4px; box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05); color: #333; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 14px; line-height: 1.5; margin: 10px;min-height: 20px; padding: 19px;
}
.fileup{
background-color: #fff;
border: 1px solid #ccc;
-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
-moz-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
-webkit-transition: border linear .2s,box-shadow linear .2s;
-moz-transition: border linear .2s,box-shadow linear .2s;
-o-transition: border linear .2s,box-shadow linear .2s;
transition: border linear .2s,box-shadow linear .2s;
}

</style>
<form action="<?php echo site_url('esatria/prosesupload');?>" enctype="multipart/form-data" method="POST">
<div class="row-fluid" id="page">
	<div class="span12">
		<div class="main-frm">
			<center><h3>Upload File Format Excel</h3></center>
			<input type="hidden" value="<?php echo $userid;?>" name="userid">
			<input type="hidden" value="<?php echo $laporan_id;?>" name="laporan_id">
			<div class="control-group">
				<label class="control-label" for="textfield">Pilih File</label>
				<div class="controls">
					<input  type="file" class="fileup" name="userfile" style="width: 98%;padding: 4px;border-radius: 3px;">
				</div>
			</div>
			<input type="submit" value="Upload" class="btn btn-success" >
		</div>
	</div>
</div>
	<script>
		
	</script>
</body>
</html>


