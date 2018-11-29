			var myApp = new Framework7();
	        var $$ = Dom7;

	        var mainView = myApp.addView('.view-main', {
	            dynamicNavbar: true
	        });

		    //var url    = 'http://45.118.112.234:10119/';
		    //var server = url+'integrasi-postgre/index.php/esatria/';
	        var url    = 'http://localhost/';
	        var server = url+'e-satria/integrasi/index.php/esatria/';

	        // local storage
	        var ambilDAta = localStorage.getItem("tampung");
	     	var amet2     = JSON.parse(ambilDAta);
	        
	        if(amet2[0]==null || amet2[1]==null || amet2[2]==null){
	            myApp.loginScreen();
	        }
	        else{
	        	var ambilDAta    = localStorage.getItem("tampung");
	     		var amet2        = JSON.parse(ambilDAta);
	        	var token        = amet2[3];
	        	var vat_type_dtl = amet2[6];
	        	var exp          = amet2[13];
	        	var date    	 = new Date();
	        	var tanggal 	 = date.getDate();
				var bulan   	 = date.getMonth();
				var tahun   	 = date.getFullYear();
				var sekrang 	 = tahun+"-"+bulan+"-"+tanggal;
	         	myApp.showPreloader();
	         	if (vat_type_dtl == 35) {
		            setTimeout(function () {
		              if (exp == tanggal) {
		              		startup();
							$('#ini_rincian').show();
							myApp.closeModal('.login-screen', 'true');
							myApp.hidePreloader();
							var nama = localStorage.getItem("nama");
							document.getElementById("buat_nama").innerHTML = nama;
		              }
		              else{
		              	myApp.hidePreloader();
		              	myApp.loginScreen();
				        myApp.alert('Session login telah habis','');
				        var toastCenter = app.toast.create({
						  text: 'I\'m on center',
						  position: 'center',
						  closeTimeout: 2000,
						});
		              }
		            }, 500);
	         	}
	         	else{
		            setTimeout(function () {
		              if (exp == tanggal) {
		              		startup();
							myApp.closeModal('.login-screen', 'true');
							myApp.hidePreloader();
							$('#ini_rincian').hide();
							var nama = localStorage.getItem("nama");
							document.getElementById("buat_nama").innerHTML = nama;
		              }
		              else{
		              	myApp.hidePreloader();
		              	myApp.loginScreen();
				        myApp.alert('Session login telah habis','');
		              }
		            }, 500);
	         	}
	        }
	        
	        function login(){
	            var username = $$('.login-screen input[name = "username"]').val();
	            var password = $$('.login-screen input[name = "password"]').val();
	            myApp.showPreloader();
	            if (username == '') {
	              myApp.hidePreloader();
	              myApp.alert('username belum diisi ', '');
	              $$('.login-screen input[name = "username"]').focus();
	            }
	            else if (password == '') {
	              myApp.hidePreloader();
	              myApp.alert('password belum diisi ', '');
	              $$('.login-screen input[name = "password"]').focus();
	            }
	            else {
	               $.ajax({
				        url: server+"login",
				        type: "post",
				        data: {username,password},
				        success: function (response) {             
				        	 var res = JSON.parse(response);
				        	 if(res.code==1){
			                      myApp.hidePreloader();
			                      var amet = [
				                      	username, 
				                      	password, 
				                      	res.code, 
				                      	res.data.token, 
				                      	res.data.user_id, 
				                      	res.data.cust_account_id, 
				                      	res.data.vat_type_dtl,
				                      	res.data.vat_type_id,
				                      	res.data.nilai_limit_nihil_restoran,
				                      	res.data.is_active_limit_restoran,
				                      	res.data.npwd,
				                      	res.data.company_name,
				                      	res.data.nama,
				                      	res.data.expired
			                      ];
			                      localStorage.setItem("tampung", JSON.stringify(amet));
			                      var ambilDAta = localStorage.getItem("tampung");
	     						  var amet2 = JSON.parse(ambilDAta);
	     						  console.log(amet2);
			                      var nama = amet2[12];
			                      document.getElementById("buat_nama").innerHTML = nama;
			                      var vat_type_dtl = amet2[6];
			                      if (vat_type_dtl == '35') {
			                      	$('#ini_rincian').show();
			                      }
			                      else{
			                      	$('#ini_rincian').hide();
			                      }
			                      startup();
			                      myApp.closeModal('.login-screen');
			                    }
			                    else {
			                      myApp.hidePreloader();
			                      myApp.alert(res.message,'');
			                      var user   = document.getElementById('username');
			                      var pass   = document.getElementById('password');
				          		  user.value ='';
				          		  pass.value ='';
			                    }
				        },
				        error: function(jqXHR, textStatus, errorThrown) {
				           console.log(textStatus, errorThrown);
				            myApp.hidePreloader();
	                   		//myApp.alert('Koneksi ke Server Bermasalah','');
	                   		myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
	                   		var getaran = navigator.vibrate(100);
	                   		console.log(getaran);
				        }
				   });
	            } 
	        }
	        function startup(){
	            $(document).ready( function () {
	            	$('#tes').hide();
	            	$('#hapus').hide();
	            	$('#jud').hide();
	            	$('#detail').hide();
	            	var ambilDAta      = localStorage.getItem("tampung");
	     			var amet2          = JSON.parse(ambilDAta);
	              	var token 		   = amet2[3];
	              	var cust_account_id= amet2[5];
	              	var vat_type_dtl   = amet2[6];
	            	var npwd 		   = amet2[10];
	              	$$('#npwpd').val(npwd);          	
	              	$$('#user').val(npwd);  	
	             	// get periode
			        $.ajax({
				        url: server+"get_periode"+"/"+token,
				        type: "post",
				        data: {cust_account_id:cust_account_id},
				        success: function (response) {             
				        	 var res = JSON.parse(response);
				        	 if(res.code==1){
			                     myApp.hidePreloader();
			                     $("#periode").empty();
				                 localStorage.setItem('a', res.data[0].p_finance_period_id);
				                 $.each(res.data, function(key,val){  
								    var markup = "<option value="+val.p_finance_period_id+">"+val.code+"</option>";
			            			$("#periode").append(markup);
								 });
								 $$('#masa_pajak_awal').val(res.data[0].start_date_string);
					             $$('#start_period').val(res.data[0].start_date_string);
					             $$('#masa_pajak_akhir').val(res.data[0].end_date_string);
					             $$('#end_period').val(res.data[0].end_date_string);
			                 }
			                 else {
			                     myApp.hidePreloader();
			                     myApp.alert(res.message,'');
			                 }
				        },
				        error: function(jqXHR, textStatus, errorThrown) {
				           console.log(textStatus, errorThrown);
				            myApp.hidePreloader();
	                   		//myApp.alert('Koneksi ke Server Bermasalah','');
	                   		myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
				        }
				    });
			        // get klasifikasi
			        $.ajax({
				        url: server+"get_klasifikasi"+"/"+token,
				        type: "post",
				        data: {vat_type_dtl:vat_type_dtl},
				        success: function (response) {             
				        	var res = JSON.parse(response);
				        	if(res.code==1){
			                	$("#klasifikasi").empty();
			                	//	localStorage.setItem('b', res.data[0].code);
			                  	if(res.data[0].p_vat_type_id == 1){
									$('#klasifikasi').append('<option selected value="KATERING">KATERING HOTEL</option>');
								} 
								else if(res.data[0].p_vat_type_id == 2 && res.data.vat_code != "KATERING"){
									$('#klasifikasi').append('<option selected value="KATERING">KATERING</option>');
								}

								if(res.data[0].vat_code == "RUMAH MAKAN"){
									$('#klasifikasi').append('<option selected value="RESTORAN">RESTORAN</option>');
								} 
								else{
									// $('#klasifikasi').append('<option selected value='+res.data[0].vat_code+'>'+res.data[0].vat_code+'</option>');
								}
			                  	$.each(res.data, function(key,val){  
								    var markup = "<option selected value="+val.vat_code+">"+val.vat_code+"</option>";
		            				$("#klasifikasi").append(markup);
								});
			                }
			                else {
			                     myApp.hidePreloader();
			                     myApp.alert(res.message,'');
			                }
				        },
				        error: function(jqXHR, textStatus, errorThrown) {
				           console.log(textStatus, errorThrown);
				            myApp.hidePreloader();
	                   		//myApp.alert('Koneksi ke Server Bermasalah','');
	                   		myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
				        }
				    });
			        // get rincian
			        $.ajax({
				        url: server+"get_rincian"+"/"+token,
				        type: "post",
				        data: {vat_type_dtl:vat_type_dtl},
				        success: function (response) {             
				        	var res = JSON.parse(response);
				        	if(res.code==1){
			                	localStorage.setItem('vat_pct', res.data[0].vat_pct);
			                  	localStorage.setItem('p_vat_type_dtl_cls_id', res.data[0].p_vat_type_dtl_cls_id);
			                  	$("#rincian").empty();
			                  	$.each(res.data, function(key,val){  
								    var markup = "<option value="+val.vat_pct+">"+val.vat_code+"</option>";
		            				$("#rincian").append(markup);
								});
			                }
			                else {
			                    myApp.hidePreloader();
			                    myApp.alert(res.message,'');
			                }
				        },
				        error: function(jqXHR, textStatus, errorThrown) {
				           console.log(textStatus, errorThrown);
				            myApp.hidePreloader();
	                   		//myApp.alert('Koneksi ke Server Bermasalah','');
	                   		myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
				        }
				    });
	         	} );
	        }
	        function logout(){
	            myApp.confirm('Yakin akan logout?', '', function () {
	              var username = document.getElementById('username');
	              var password = document.getElementById('password');
		          username.value='';
		          password.value='';
	              localStorage.clear();
	              location.reload();
	            });
	        }  
	        function keluar(){
	            myApp.confirm('Apakah yakin ingin keluar aplikasi?', '', function () {
	              navigator.app.exitApp();
	            });
	        }
	        function download_manual() {
				window.open('http://45.118.112.234:10119/wajib-pajak-postgre/poster/manual_pdf.pdf', '_system');
			}
	        function onBackKeyDown(){
			    var mlogin 	   = $$('#m-login').css("display");
			    var mpelaporan = $$('#m-pelaporan').css("display");
			    var mtransaksi = $$('#m-transaksi').css("display");
			    var mhistory   = $$('#m-history').css("display");
			    var mupload    = $$('#m-upload').css("display");
			    var mform      = $$('#m-form').css("display");
			    var mformedit  = $$('#m-form-edit').css("display");
			    var mhistoryaksi = $$('#m-history-aksi').css("display");
			    var mformopsi  = $$('#m-form-opsi').css("display");
			    var mkonfirmasi= $$('#m-konfirmasi').css("display");
			    var mpiker 	   = $$('#m-history-aksi').css("display");
			    var mpikerform = $$('#m-form-opsi').css("display");
			    var cpage 	   = mainView.activePage;
			    var cpagename  = cpage.name;
			    console.log(cpagename);
			    if(mlogin == 'block'){
			        myApp.confirm('Apakah yakin ingin keluar aplikasi?', '', function () {
		              navigator.app.exitApp();
		            });
			    } else if(mpelaporan == 'block'){
			        myApp.closeModal();
			        return false;
			    } else if (mtransaksi == 'block'){
			    	$('#jud').hide();
			    	$('#detail').hide();
	        		$("#load-detail").empty();
			        myApp.closeModal();
			        return false;
			    } else if (mpiker == 'block'){
			        myApp.closeModal('.picker-1')
			        return false;
			    } else if (mhistory == 'block'){
			        myApp.closeModal();
			        return false;
			    } else if (mupload == 'block') {
			        myApp.closeModal();
	        	 	myApp.popup('.popup-pelaporan');
			        return false;
			    } else if (mpikerform == 'block') {
			        myApp.closeModal('.picker-form')
			        return false;
			    } else if (mform == 'block') {
			        myApp.closeModal();
			        // myApp.closeModal('.picker-form')
	        	 	myApp.popup('.popup-pelaporan');
			        return false;
			    } else if (mformedit == 'block') {
			        myApp.closeModal();
			        myApp.popup('.popup-form');
			        return false;
			    } else if (mkonfirmasi == 'block') {
			        myApp.closeModal();
			        myApp.popup('.popup-pelaporan');
			        return false;
			    } else if (($$('#leftpanel').hasClass('active')) || ($$('#panel').hasClass('active'))) { 
			    	myApp.closePanel();
			        return false;
			    } else if (cpagename == 'home') {
				    myApp.confirm('Apakah yakin ingin keluar aplikasi?', '', function () {
		              navigator.app.exitApp();
		            });
			    } 
			    else {
			      	mainView.router.back();
			    }
		    }
		    function convertToRupiah(angka){
			    var rupiah = '';
			    var angkarev = angka.toString().split('').reverse().join('');
			    for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
			    return rupiah.split('',rupiah.length-1).reverse().join('');
			}

	        // Menu Pelaporan
	        function pelaporan(){
	        	var ambilDAta = localStorage.getItem("tampung");
	     		var amet2     = JSON.parse(ambilDAta);
	        	var token 	  = amet2[3];
	        	var a_ 		  = localStorage.getItem("a");
	        	myApp.showPreloader();
		        $.ajax({
				    url: server+"get_laporan"+"/"+token,
				    type: "post",
				    data: {periode:a_},
				    success: function (response) {             
				    	var res = JSON.parse(response);
				    	if(res.code==1){
			            	myApp.popup('.popup-pelaporan');
		                    myApp.hidePreloader();
		                    localStorage.setItem('booldendamonth', res.data.boolDendaMonth);
		                    localStorage.setItem('booldenda', res.data.boolDenda);
			            }
			            else {
			                myApp.hidePreloader();
			                myApp.alert(res.message,'');
			            }
				    },
				    error: function(jqXHR, textStatus, errorThrown) {
				        console.log(textStatus, errorThrown);
				        myApp.hidePreloader();
	                	//myApp.alert('Koneksi ke Server Bermasalah','');
	                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
							myApp.confirm('Ingin keluar aplikasi?', '', function () {
							    navigator.app.exitApp();
							});
						});
				    }
				});
	        }
	        function batal_form(){
			    var nilai_omset 	 = document.getElementById('nilai_omset');
			    var pajak 			 = document.getElementById('pajak');
			    var denda 			 = document.getElementById('denda');
			    var total_bayar 	 = document.getElementById('total_bayar');
			    var file 			 = document.getElementById('file');
			    nilai_omset.value      ='';
			    pajak.value            ='';
			    denda.value            ='';
			    total_bayar.value      ='';
			    file.value 		       ='';	
			    myApp.closeModal();
		    }
		    function konfirmasi(){
		    	var merk_dagang	= localStorage.getItem("company_name");
	        	var npwpd 		= $$('.popup-pelaporan input[name = "npwpd"]').val();
	        	var klasifikasi = $$('#klasifikasi').val();
	        	var masa 		= $$('.popup-pelaporan input[name = "masa_pajak_awal"]').val();
	        	var pajak 		= $$('.popup-pelaporan input[name = "pajak"]').val();
	        	var denda 		= $$('.popup-pelaporan input[name = "denda"]').val();
	        	var jml 		= $$('.popup-pelaporan input[name = "total_bayar"]').val();
	        	myApp.showPreloader();
	        	if (masa == '') {
	        		myApp.alert('masa pajak masih kosong ', '');
	             	myApp.hidePreloader();
	        	}
	        	else if (pajak == '') {
	        		myApp.alert('nilai pajak masih kosong ', '');
	             	myApp.hidePreloader();
	        	}
	        	else if (denda == '') {
	        		myApp.alert('nilai denda masih kosong ', '');
	             	myApp.hidePreloader();
	        	}
	        	else if (jml == '') {
	        		myApp.alert('total bayar masih kosong ', '');
	             	myApp.hidePreloader();
	        	}
	        	else {
	        		setTimeout(function () {
	        			myApp.hidePreloader();
	        			myApp.closeModal();
		              	myApp.popup('.popup-konfirmasi');
		        		document.getElementById("k_npwpd").innerHTML 		= npwpd;
		        		document.getElementById("m_dagang").innerHTML 		= merk_dagang;
			        	document.getElementById("k_klasifikasi").innerHTML 	= klasifikasi;
			        	document.getElementById("k_masa").innerHTML 		= masa;
			        	document.getElementById("k_pajak").innerHTML 		= 'Rp. ' + convertToRupiah(Math.round(pajak));
			        	document.getElementById("k_denda").innerHTML 		= 'Rp. ' + convertToRupiah(Math.round(denda));
			        	document.getElementById("k_jml").innerHTML 			= 'Rp. ' + convertToRupiah(Math.round(jml));
		            }, 300);
	        	}
	        }
	        function batal_konfirmasi(){
			    myApp.closeModal();
			    myApp.popup('.popup-pelaporan');
		    }
	        function submit_form() {
	        	var id        	= $$('.popup-pelaporan input[name = "laporan_id"]').val();
	        	var npwpd     	= $$('.popup-pelaporan input[name = "npwpd"]').val();
	        	var awal      	= $$('.popup-pelaporan input[name = "masa_pajak_awal"]').val();
	        	var akhir    	= $$('.popup-pelaporan input[name = "masa_pajak_akhir"]').val();
	        	var start_period= $$('.popup-pelaporan input[name = "start_period"]').val();
	        	var end_period  = $$('.popup-pelaporan input[name = "end_period"]').val();
	        	var omset     	= $$('.popup-pelaporan input[name = "nilai_omset"]').val();
	        	var pajak     	= $$('.popup-pelaporan input[name = "pajak"]').val();
	        	var denda     	= $$('.popup-pelaporan input[name = "denda"]').val();
	        	var total     	= $$('.popup-pelaporan input[name = "total_bayar"]').val();
	            var periode     = $$('#periode').val();
	            var klasifikasi = $$('#klasifikasi').val();
	            var rincian 	= $$('#rincian').val();
	            var ambilDAta   	= localStorage.getItem("tampung");
	     		var amet2       	= JSON.parse(ambilDAta);
	            var token    		= amet2[3];
	            var cust_account_id = amet2[5];
	            var vat_type_dtl    = amet2[6];
	            var npwd 			= amet2[10];
	            var vat_pct    		= localStorage.getItem("vat_pct");
	            myApp.showPreloader();
	            if (periode == '') {
	              myApp.alert('periode belum diisi ', '');
	              myApp.hidePreloader();
	              $$('.popup-pelaporan input[name = "periode"]').focus();
	            }
	            else if(npwpd == '') {
	              myApp.alert('npwpd masih kosong ', '');
	              myApp.hidePreloader();
	            }
	            else if(awal == '') {
	              myApp.alert('masa pajak masih kosong ', '');
	              myApp.hidePreloader();
	            }
	            else if(omset == '') {
	              myApp.alert('nilai omset masih kosong ', '');
	              myApp.hidePreloader();
	            }
	            else if(pajak == '') {
	              myApp.alert('pajak dibayar masih kosong ', '');
	              myApp.hidePreloader();
	            }
	            else if(denda == '') {
	              myApp.alert('denda masih kosong ', '');
	              myApp.hidePreloader();
	            }
	            else if(total == '') {
	              myApp.alert('total_bayar masih kosong ', '');
	              myApp.hidePreloader();
	            }
	            else {
			        $.ajax({
					    url: server+"submit_lpaoran"+"/"+token,
					    type: "post",
					    data: {dat_cust_account_id:cust_account_id, npwd:npwd, periode:periode, vat_type_dtl:vat_type_dtl, vat_pct:vat_pct, klasifikasi:klasifikasi, rincian:rincian, awal:start_period, akhir:end_period, omset:omset, pajak:pajak, denda:denda, total:total},
					    success: function (response) {             
					    	var res = JSON.parse(response);
					    	if(res.code==1){
					    		myApp.hidePreloader();
			                    $("#form").hide();
			                    myApp.alert(res.data.message,'');
			              		var masa_pajak_awal  = document.getElementById('masa_pajak_awal');
			              		var masa_pajak_akhir = document.getElementById('masa_pajak_akhir');
			              		var nilai_omset 	 = document.getElementById('nilai_omset');
			              		var pajak 			 = document.getElementById('pajak');
			              		var denda 			 = document.getElementById('denda');
			              		var total_bayar 	 = document.getElementById('total_bayar');
			              		masa_pajak_awal.value='';
			              		masa_pajak_akhir.value='';
			              		nilai_omset.value 	 ='';
			              		pajak.value 		 ='';
			              		denda.value 		 ='';
			              		total_bayar.value 	 ='';
			              		myApp.closeModal('.popup-konfirmasi');
			              		myApp.closeModal('.popup-pelaporan');
				            }
				            else {
				                myApp.hidePreloader();
				                myApp.alert(res.message,'');
				            }
					    },
					    error: function(jqXHR, textStatus, errorThrown) {
					        console.log(textStatus, errorThrown);
					        myApp.hidePreloader();
		                	//myApp.alert('Koneksi ke Server Bermasalah','');
		                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
					    }
					});
	            } 
	        }	
	        function get_laporan() {
	        	var id      = $$('.popup-pelaporan input[name = "laporan_id"]').val();
	            var periode = $$('#periode').val();
	            var ambilDAta = localStorage.getItem("tampung");
	     		var amet2     = JSON.parse(ambilDAta);
	            var token     = amet2[3];
	            myApp.showIndicator();
	            $$.post(server+'get_laporan/'+token, {periode:periode}, 
	              function (data){
	                var res = JSON.parse(data);
	                if(res.code==1){
	                  myApp.hideIndicator();
	                   localStorage.setItem('booldendamonth', res.data.boolDendaMonth);
	                   localStorage.setItem('booldenda', res.data.boolDenda);
	                   //$$('#laporan_id').val(res.data.laporan_id);
	                   $$('#masa_pajak_awal').val(res.data.masa_pajak_awal);
	                   $$('#start_period').val(res.data.start_period);
	                   $$('#masa_pajak_akhir').val(res.data.masa_pajak_akhir);
	                   $$('#end_period').val(res.data.end_period);
	                }
	                else {
	                  myApp.hidePreloader();
	                  myApp.alert(res.message,'');
	                }
	              },
	              function (xhr, status) {
	                myApp.hideIndicator();
	                myApp.alert('Koneksi ke Server Bermasalah','');
	              }
	            );
	        }   
	        function get_rincian() {
	        	var booldendamonth = localStorage.getItem("booldendamonth");
	        	var booldenda      = localStorage.getItem("booldenda");
	        	var nilai_pajak    = $$('#rincian').val();
	        	$('#pajak').val(  $('#nilai_omset').val() * nilai_pajak * 0.01);
	        	if($('#nilai_omset').val() == 0)
				{
					$('#nilai_omset').val( 0 );
				}
				if ($('#nilai_omset').val() != 0)
				{
					$('#pajak').val(  $('#nilai_omset').val() * nilai_pajak * 0.01);
				} 
				else {
					$('#pajak').val(  0 );
				}
				var kelipatan_denda = booldendamonth;
				if(parseInt(booldenda) >= 0)
				{
					if(parseInt(kelipatan_denda > 24)){
							kelipatan_denda = 24;
					}
					$('#denda').val(0.02 * $('#pajak').val() * kelipatan_denda);
					var total = parseInt($('#denda').val()) + parseInt($('#pajak').val());
					$('#total_bayar').val(total);
				}
				else
				{
					$('#denda').val(0);
					$('#total_bayar').val($('#pajak').val());
				}
	        } 
	         	// isi form
	         	function isiForm(){
		        	var id    			= $$('.popup-pelaporan input[name = "laporan_id"]').val(); 
		        	var awal   		    = $$('.popup-pelaporan input[name = "start_period"]').val();
		        	var akhir    	    = $$('.popup-pelaporan input[name = "end_period"]').val();
		        	var periode     	= $$('#periode').val();
		        	var rincian 		= $$('#rincian').val();
		        	var ambilDAta	    = localStorage.getItem("tampung");
	     			var amet2 	        = JSON.parse(ambilDAta);
		        	var token 			= amet2[3]; 
		        	var cust_account_id = amet2[5];
		        	var vat_type_dtl    = amet2[6]; 
		        	var npwd   	   	    = amet2[10];
		            myApp.showPreloader();
		            $("#load-data-here").empty();
			        $.ajax({
					    url: server+"get_tabel"+"/"+token,
					    type: "post",
					    data: {npwd:npwd, periode:periode, vat_pct:rincian, cust_account_id:cust_account_id, vat_type_dtl:vat_type_dtl, start_period:awal, end_period:akhir},
					    success: function (response) {             
					    	var res = JSON.parse(response);
					    	if(res.code==1){
			                  	myApp.hidePreloader();	
			                  	myApp.closeModal();
			                  	myApp.popup('.popup-form');
			                  	//$("#load-data-here").empty();
			                  	if (res.jumlah < 28) {
			                  		$('#tes').show();
			                  		$('#hapus').show();
			                  		$("#load-data-here").empty();
			                  		$.each(res.data, function(key,val){  
										$$('#edt').val(val.t_cust_acc_dtl_trans_id);	
									    var markup = "<tr onclick=opsi("+val.t_cust_acc_dtl_trans_id+")>;<td style='border-bottom: 1px solid #111;'><br><center>"+val.trans_date_jqgrid+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+val.bill_no+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+val.bill_no_end+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+val.bill_count+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+convertToRupiah(Math.round(val.service_charge))+"</center></td><td style='border-bottom: 1px solid #111;'><br>"+val.service_desc+"</td></tr>";
			           					$("#load-data-here").append(markup);
									});
			                  	}
			                  	else{
			                  		$('#tes').hide();
			                  		//$("#load-data-here").empty();
			                  		$.each(res.data, function(key,val){  
										$$('#edt').val(val.t_cust_acc_dtl_trans_id);	
									    var markup = "<tr onclick=opsi("+val.t_cust_acc_dtl_trans_id+")>;<td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.trans_date_jqgrid+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.bill_no+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.bill_no_end+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.bill_count+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+convertToRupiah(Math.round(val.service_charge))+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'>"+val.service_desc+"</td></tr>";
			           					$("#load-data-here").append(markup);
									});
			                  	}
				            }
				            else {
				                myApp.hidePreloader();
				                myApp.alert(res.message,'');
				            }
					    },
					    error: function(jqXHR, textStatus, errorThrown) {
					        console.log(textStatus, errorThrown);
					        myApp.hidePreloader();
		                	//myApp.alert('Koneksi ke Server Bermasalah','');
		                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
					    }
					});
		        }	       
		        function editForm(){
		        	myApp.closeModal('.picker-form');
		        	var id        		= $$('.popup-pelaporan input[name = "edt"]').val();
		        	var awal   		    = $$('.popup-pelaporan input[name = "start_period"]').val();
		        	var akhir    	    = $$('.popup-pelaporan input[name = "end_period"]').val();
		        	var ambilDAta    	= localStorage.getItem("tampung");
	     			var amet2       	= JSON.parse(ambilDAta);
		        	var token     		= amet2[3];
		        	var cust_account_id = amet2[5]; 
		        	var vat_type_dtl    = amet2[6]; 
		        	var id_detail 		= localStorage.getItem("laporan_detail_id");
		            $$('#edt_detail').val('');
				    $$('#edt_tanggal').val('');
				    $$('#edt_no_faktur_awal').val('');
				    $$('#edt_no_faktur_akhir').val('');
				    $$('#edt_jml_faktur').val('');
				    $$('#edt_jml_penjualan').val('');
				    $$('#edt_deskripsi').val('');
		        	myApp.showPreloader();
				    $.ajax({
					    url: server+"get_transaksi"+"/"+token,
					    type: "post",
					    data: {dat_cust_acc_dtl_trans_id:id_detail, vat_type_dtl:vat_type_dtl, cust_account_id:cust_account_id, start_period:awal, end_period:akhir},
					    success: function (response) {             
					    	var res = JSON.parse(response);
					    	if(res.code==1){
				            	myApp.hidePreloader();
				            	myApp.closeModal();
				            	myApp.popup('.popup-formedit');
				            	var nilai = convertToRupiah(Math.round(res.data.service_charge));
				            	//alert(nilai);
				                $$('#edt_detail').val(res.data.t_cust_acc_dtl_trans_id);
				                $$('#edt_tanggal').val(res.data.trans_date_jqgrid);
				                $$('#edt_no_faktur_awal').val(res.data.bill_no);
				                $$('#edt_no_faktur_akhir').val(res.data.bill_no_end);
				                $$('#edt_jml_faktur').val(res.data.bill_count);
				                $$('#edt_jml_penjualan').val(Math.round(res.data.service_charge));
				                $$('#edt_deskripsi').val(res.data.service_desc);
				            }
				            else {
				                myApp.hidePreloader();
				                myApp.alert(res.message,'');
				            }
					    },
					    error: function(jqXHR, textStatus, errorThrown) {
					        console.log(textStatus, errorThrown);
					        myApp.hidePreloader();
		                	//myApp.alert('Koneksi ke Server Bermasalah','');
		                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
					    }
					});
		        }
		        function simpan_edit(){
		        	var periode   = $$('#periode').val();
		        	var id        = $$('.popup-pelaporan input[name = "laporan_id"]').val();
		            var det       = $$('.popup-formedit input[name = "edt_detail"]').val();
		            var tgl       = $$('.popup-formedit input[name = "edt_tanggal"]').val();
		            var no_awal   = $$('.popup-formedit input[name = "edt_no_faktur_awal"]').val();
		            var no_akhir  = $$('.popup-formedit input[name = "edt_no_faktur_akhir"]').val();
		            var jml       = $$('.popup-formedit input[name = "edt_jml_faktur"]').val();
		            var nilai     = $$('.popup-formedit input[name = "edt_jml_penjualan"]').val();
		            var deskripsi = $$('.popup-formedit input[name = "edt_deskripsi"]').val();
		        	var awal   		   = $$('.popup-pelaporan input[name = "start_period"]').val();
		        	var akhir    	   = $$('.popup-pelaporan input[name = "end_period"]').val();
		            var nilai_pajak    = $$('#rincian').val();
		            var klasifikasi    = $$('#klasifikasi').val();
		            var ambilDAta      = localStorage.getItem("tampung");
	     			var amet2          = JSON.parse(ambilDAta);
		            var token   	   = amet2[3]; 
		        	var cust_account_id= amet2[5]; 
		            var vat_type_dtl   = amet2[6];
		            var limit_restoran = amet2[8]; 
		            var limit_active   = amet2[9];
		            var booldendamonth = localStorage.getItem("booldendamonth");
		        	var booldenda      = localStorage.getItem("booldenda");
		            var detail    	   = localStorage.getItem("laporan_detail_id");
		            myApp.showPreloader();
		            if (no_awal == '') {
		            	myApp.alert('no faktur awal belum diisi ', '');
			            myApp.hidePreloader();
			            $$('.popup-pelaporan input[name = "edt_no_faktur_awal"]').focus();
		            }
		            else if (no_akhir == '') {
		            	myApp.alert('no faktur akhir belum diisi ', '');
			            myApp.hidePreloader();
			            $$('.popup-pelaporan input[name = "edt_no_faktur_akhir"]').focus();
		            }
		            else if(jml == '') {
		            	myApp.alert('jumlah faktur belum diisi ', '');
			            myApp.hidePreloader();
			            $$('.popup-pelaporan input[name = "edt_jml_faktur"]').focus();
		            }
		            else if(nilai == '') {
		            	myApp.alert('jumlah penjualan belum diisi ', '');
			            myApp.hidePreloader();
			            $$('.popup-pelaporan input[name = "edt_jml_penjualan"]').focus();
		            }
		            else{
			            if (nilai_pajak != '') {
							$.ajax({
							    url: server+"edit_transaksi"+"/"+token+"/"+booldendamonth+"/"+booldenda+"/"+nilai_pajak,
							    type: "post",
							    data: {cust_account_id:cust_account_id, periode:periode, start_period:awal, end_period:akhir, dat_cust_acc_dtl_trans_id:det, vat_type_dtl:vat_type_dtl, tanggal:tgl, no_faktur_awal:no_awal, no_faktur_akhir:no_akhir, jml_faktur:jml, jml_penjualan:nilai, deskripsi:deskripsi},
							    success: function (response) {             
							    	var res = JSON.parse(response);
							    	if(res.code==1){
						            	myApp.hidePreloader();;
										myApp.closeModal();
								        myApp.popup('.popup-form');
										$$('#nilai_omset').val(res.data.hasil.nilai_omset);
					                    $$('#pajak').val(res.data.hasil.pajak);
					                    $$('#denda').val(res.data.hasil.denda);
					                    $$('#total_bayar').val(res.data.hasil.total_bayar);
					                    $("#load-data-here").empty();
					              		$.each(res.data.tabel, function(key,val){  	
											var markup = "<tr onclick=opsi("+val.t_cust_acc_dtl_trans_id+")>;<td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.trans_date+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.bill_no+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.bill_no_end+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+val.bill_count+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'><center>"+convertToRupiah(Math.round(val.service_charge))+"</center></td><td style='border-bottom: 1px solid #111; height: 40px;'>"+val.service_desc+"</td></tr>";
						           			$("#load-data-here").append(markup);
										});
						            }
						            else {
						                myApp.hidePreloader();
						                myApp.alert(res.message,'');
						            }
							    },
							    error: function(jqXHR, textStatus, errorThrown) {
							        console.log(textStatus, errorThrown);
							        myApp.hidePreloader();
				                	//myApp.alert('Koneksi ke Server Bermasalah','');
				                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
										myApp.confirm('Ingin keluar aplikasi?', '', function () {
									        navigator.app.exitApp();
									    });
									});
							    }
							});
			            }
			            else{
							$.ajax({
							    url: server+"edit_transaksi"+"/"+token+"/"+booldendamonth+"/"+booldenda+"/0",
							    type: "post",
							    data: {limit_restoran:limit_restoran, limit_active:limit_active, klasifikasi:klasifikasi, cust_account_id:cust_account_id, periode:periode, start_period:awal, end_period:akhir, dat_cust_acc_dtl_trans_id:det, vat_type_dtl:vat_type_dtl, tanggal:tgl, no_faktur_awal:no_awal, no_faktur_akhir:no_akhir, jml_faktur:jml, jml_penjualan:nilai, deskripsi:deskripsi},
							    success: function (response) {             
							    	var res = JSON.parse(response);
							    	if(res.code==1){
						            	myApp.hidePreloader();
								        myApp.closeModal();
								        myApp.popup('.popup-form');
										$$('#nilai_omset').val(res.data.hasil.nilai_omset);
					                    $$('#pajak').val(res.data.hasil.pajak);
					                    $$('#denda').val(res.data.hasil.denda);
					                    $$('#total_bayar').val(res.data.hasil.total_bayar);
					                    $("#load-data-here").empty();
					              		$.each(res.data.tabel, function(key,val){  	
											var markup = "<tr onclick=opsi("+val.t_cust_acc_dtl_trans_id+")>;<td style='border-bottom: 1px solid #111;'><br><center>"+val.trans_date+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+val.bill_no+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+val.bill_no_end+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+val.bill_count+"</center></td><td style='border-bottom: 1px solid #111;'><br><center>"+convertToRupiah(Math.round(val.service_charge))+"</center></td><td style='border-bottom: 1px solid #111;'><br>"+val.service_desc+"</td></tr>";
						           			$("#load-data-here").append(markup);
										});
						            }
						            else {
						                myApp.hidePreloader();
						                myApp.alert(res.message,'');
						            }
							    },
							    error: function(jqXHR, textStatus, errorThrown) {
							        console.log(textStatus, errorThrown);
							        myApp.hidePreloader();
				                	myApp.alert('Koneksi ke Server Bermasalah','');
							    }
							});
			            }
		            }
		        }
		        function opsi(dat_cust_acc_dtl_trans_id){
		        	localStorage.setItem('laporan_detail_id', dat_cust_acc_dtl_trans_id);
		        	$$('#edt').val(dat_cust_acc_dtl_trans_id);
		        	myApp.popup('.picker-form');
		        }
		        function selesai_form(){
			        myApp.closeModal();
			        myApp.popup('.popup-pelaporan');
		        }
		        function batal_transaksi(){
		        	var ambilDAta      = localStorage.getItem("tampung");
	     			var amet2          = JSON.parse(ambilDAta);
		        	var token 		   = amet2[3];
		        	var cust_account_id= amet2[5];
		            myApp.showPreloader();
		            $.ajax({
					    url: server+"delete_transaksi"+"/"+token,
					    type: "post",
					    data: {cust_account_id:cust_account_id},
					    success: function (response) {             
					    	var res = JSON.parse(response);
					    	if (res.code==1) {
					    		myApp.hidePreloader();
					    		myApp.closeModal();
					    		myApp.popup('.popup-pelaporan');
					    		var nilai_omset 	 = document.getElementById('nilai_omset');
							    var pajak 			 = document.getElementById('pajak');
							    var denda 			 = document.getElementById('denda');
							    var total_bayar 	 = document.getElementById('total_bayar');
							    var file 			 = document.getElementById('file');
							    nilai_omset.value      ='';
							    pajak.value            ='';
							    denda.value            ='';
							    total_bayar.value      ='';
							    file.value 		       ='';
					    	}
					    	else{
					    		myApp.hidePreloader();
		                		myApp.alert(res.message,'');
					    	}
					    },
					    error: function(jqXHR, textStatus, errorThrown) {
					        console.log(textStatus, errorThrown);
					        myApp.hidePreloader();
		                	//myApp.alert('Koneksi ke Server Bermasalah','');
		                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
					    }
					});
		        }
		        function batal_edit(){
			        myApp.closeModal();
			        myApp.popup('.popup-form');
		        }
		        function back_form(){
		        	 myApp.closeModal();
		        	 myApp.popup('.popup-pelaporan');
		        }
		        function back_edit(){
		        	 myApp.closeModal();
		        	 myApp.popup('.popup-form');
		        }
		        // upload file
		        function uploadFile(){
		            myApp.closeModal();
		            myApp.popup('.popup-upload');
		        }
		        function getFile() {
		        	var input = document.getElementById('file');
					var options = {};
					fileChooser.open(function(imgData){
						var filename =imgData.substr(imgData.lastIndexOf('/') + 1);
						if (imgData != '') {
							input.value = filename;
							localStorage.setItem('path', imgData);
						}
					}, error);
					function error(msg){
						console.log(msg);
					}
				}  
		        function aksiUpload(){
		        	var periode   	   = $$('#periode').val();
		            var vat_pct 	   = $$('#rincian').val();
		            var tgl       	   = $$('.popup-form input[name = "tanggal"]').val();
		            var file  	  	   = $$('.popup-upload input[name = "file"]').val();
		            var start_period   = $$('.popup-pelaporan input[name = "start_period"]').val();
		        	var end_period     = $$('.popup-pelaporan input[name = "end_period"]').val();
		            var nilai_pajak    = $$('#rincian').val();
		            var klasifikasi    = $$('#klasifikasi').val();
		            var ambilDAta      = localStorage.getItem("tampung");
	     			var amet2          = JSON.parse(ambilDAta);
		            var token 	  	   = amet2[3];
		            var cust_account_id= amet2[5]; 
		        	var vat_type_dtl   = amet2[6];
		            var limit_restoran = amet2[8]; 
		            var limit_active   = amet2[9]; 
		            var npwd   	   	   = amet2[10];
		        	var path  	  	   = localStorage.getItem("path");
		            var booldendamonth = localStorage.getItem("booldendamonth");
		        	var booldenda      = localStorage.getItem("booldenda");
		            if (start_period == '') {
		            	myApp.alert('periode masih kosong', '');
		            }
		            else if (vat_pct == '') {
		            	myApp.alert('rincian masih kosong', '');
		            }
		            else if (file == '') {
		              myApp.hidePreloader();
		              myApp.alert('tidak ada file dipilih', '');
		              $$('.popup-upload input[name = "file"]').focus();
		            }
		            else {
		                myApp.showPreloader();
		              	if (nilai_pajak != '') {
		              		var imageURI	 = path;
							var options 	 = new FileUploadOptions();
							options.fileKey  = "myfile";
							var filename 	 =imageURI.substr(imageURI.lastIndexOf('/') + 1);
							options.fileName = filename;
							options.mimeType = "application/vnd.ms-excel";
							options.headers  = {
								Connection: "close"
							};
							var params 			= new Object();
							options.params  	= params;
							options.chunkedMode = false;
							var ft 				= new FileTransfer();
							var urlUpload = server+'prosesupload'+'/'+token+'/'+booldendamonth+'/'+booldenda+'/'+nilai_pajak+'/'+npwd+'/'+cust_account_id+'/'+vat_type_dtl+'/'+periode+'/'+vat_pct+'/'+start_period+'/'+end_period; // url webservice untuk upload
							ft.upload(imageURI, urlUpload, win, fail, options);
							function win(r) {
								console.log("Code = " + r.responseCode);
								console.log("Response = " + r.response);
								console.log("Sent = " + r.bytesSent);
									
								var res = JSON.parse(r.response);
								if (res.code == 1) {
									myApp.hidePreloader();
						        	$$('#nilai_omset').val(res.data.hasil.nilai_omset);
						            $$('#pajak').val(res.data.hasil.pajak);
						            $$('#denda').val(res.data.hasil.denda);
						            $$('#total_bayar').val(res.data.hasil.total_bayar);
						            var fileinput = document.getElementById('file');
						            fileinput.value='';
									myApp.closeModal('.popup-upload');
								}
								else {
									alert(res.message);
									myApp.hidePreloader();
								}							
							}
							function fail(error) {
								alert(error.code);
								console.log("upload error source " + error.source);
								console.log("upload error target " + error.target);
							}
		              	}
		              	else {
		              		var options 	 = new FileUploadOptions();
							options.fileKey  = "myfile";
							var filename 	 =imageURI.substr(imageURI.lastIndexOf('/') + 1);
							options.fileName = filename;
							options.mimeType = "application/vnd.ms-excel";
							options.headers  = {
								Connection: "close"
							};
							var params 			= new Object();
							options.params  	= params;
							options.chunkedMode = false;
							var ft 				= new FileTransfer();
							var urlUpload = server+'prosesupload_'+'/'+token+'/'+booldendamonth+'/'+booldenda+'/0/'+npwd+'/'+cust_account_id+'/'+vat_type_dtl+'/'+periode+'/'+vat_pct+'/'+start_period+'/'+end_period+'/'+limit_restoran+'/'+limit_active+'/'+klasifikasi; // url webservice untuk upload
							ft.upload(imageURI, urlUpload, win, fail, options);
							function win(r) {
								console.log("Code = " + r.responseCode);
								console.log("Response = " + r.response);
								console.log("Sent = " + r.bytesSent);
									
								var res = JSON.parse(r.response);
								if (res.code == 1) {
									myApp.hidePreloader();
						        	$$('#nilai_omset').val(res.data.hasil.nilai_omset);
						            $$('#pajak').val(res.data.hasil.pajak);
						            $$('#denda').val(res.data.hasil.denda);
						            $$('#total_bayar').val(res.data.hasil.total_bayar);
						            var fileinput = document.getElementById('file');
						            fileinput.value='';
									myApp.closeModal('.popup-upload');
								}
								else {
									alert(res.message);
									myApp.hidePreloader();
								}							
							}
							function fail(error) {
								alert(error.code);
								console.log("upload error source " + error.source);
								console.log("upload error target " + error.target);
							}
		              	}
		            }
		        }
	        	function batal_upload(){
			        var file   = document.getElementById('file');
			        file.value ='';
			        myApp.closeModal();
			        myApp.popup('.popup-pelaporan');
		        }
		        function back_upload(){
		        	 myApp.closeModal();
		        	 myApp.popup('.popup-pelaporan');
		        }
		        
	    	// Menu Transaski Harian    
	        function transaksi_harian(){
	        	var ambilDAta      = localStorage.getItem("tampung");
	     		var amet2          = JSON.parse(ambilDAta);
	            var token 		   = amet2[3];
	        	var cust_account_id= amet2[5];
	        	var npwd 		   = amet2[10];
	        	myApp.showPreloader();
			    $.ajax({
				    url: server+"transaksi_harian"+"/"+token,
				    type: "post",
				    data: {npwd:npwd, cust_account_id:cust_account_id},
				    success: function (response) {             
				    	var res = JSON.parse(response);
				    	if(res.code==1){
			            	myApp.popup('.popup-transaksi');
			                myApp.hidePreloader();	
			                $(".pager").remove();
			                $("#transaksi_disini").empty();
			                $.each(res.data.tabel, function(key,val){  
			                	if (val.p_order_status_id == null) {
			                		var status = 'Laporan Belum Dikirim';
			                  	}
			                  	else if (val.p_order_status_id == 1 || val.p_order_status_id == 2){
			                  		var status = 'Belum Verifikasi';
			                  	}
			                  	else {
			                  		var status = 'Sudah Verifikasi';
			                  	}
			                  	localStorage.setItem('awal_period', val.start_period);
			                  	localStorage.setItem('akhir_period', val.end_period);
								var markup = "<tr onclick='detail("+val.p_finance_period_id+","+val.p_vat_type_dtl_id+","+val.t_cust_account_id+")'><td style='border-bottom: 1px solid #111;text-align: center;'><br>"+val.code+"<br><br></td><td style='border-bottom: 1px solid #111; text-align: center;''><br>"+val.start_period+" s.d "+val.end_period+"<br><br></td><td style='border-bottom: 1px solid #111; text-align: center;''><br>"+status+"<br><br></td><td style='border-bottom: 1px solid #111; text-align: center;'><br>"+convertToRupiah(Math.round(val.jum_trans))+"<br><br></td><td style='border-bottom: 1px solid #111; text-align: center;'><br>"+convertToRupiah(Math.round(val.jum_pajak))+"<br><br></td></tr>";
		            			$("#transaksi_disini").append(markup);
							});
			            }
			            else {
			                myApp.hidePreloader();
			                myApp.alert(res.message,'');
			            }
				    },
				    error: function(jqXHR, textStatus, errorThrown) {
				        console.log(textStatus, errorThrown);
				        myApp.hidePreloader();
	                	//myApp.alert('Koneksi ke Server Bermasalah','');
	                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
							myApp.confirm('Ingin keluar aplikasi?', '', function () {
						        navigator.app.exitApp();
						    });
						});
				    }
				});
	        }
	        	// detail transaski
		        function detail(p_finance_period_id,p_vat_type_dtl_id,t_cust_account_id){
		        	$("#load-detail").empty();
		        	var ambilDAta = localStorage.getItem("tampung");
	     			var amet2     = JSON.parse(ambilDAta);
		        	var token	  = amet2[3];
		        	var s_p 	  = localStorage.getItem("awal_period");
		        	var e_p 	  = localStorage.getItem("akhir_period");
		        	myApp.showPreloader();
				    $.ajax({
					    url: server+"read_acc_trans"+"/"+token,
					    type: "post",
					    data: {periode:p_finance_period_id, vat_type_dtl:p_vat_type_dtl_id, cust_account_id:t_cust_account_id, start_period:s_p, end_period:e_p},
					    success: function (response) {             
					    	var res = JSON.parse(response);
					    	if(res.code==1){
				            	$('#jud').show();
				                $('#detail').show();
				                $("#load-detail").empty();
				                $.each(res.data, function(key,val){  
								    var markup = "<tr><td height='50px;' style='border-bottom: 1px solid #111;'><center>"+val.trans_date_jqgrid+"</center></td><td style='border-bottom: 1px solid #111;'><center>"+val.bill_no+" - "+val.bill_no_end+"</center></td><td style='border-bottom: 1px solid #111;'>"+val.service_desc+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+convertToRupiah(Math.round(val.service_charge))+"</td></tr>";
			            			$("#load-detail").append(markup);
								});
								myApp.hidePreloader();
				            }
				            else {
				                myApp.hidePreloader();
				                myApp.alert(res.message,'');
				            }
					    },
					    error: function(jqXHR, textStatus, errorThrown) {
					        console.log(textStatus, errorThrown);
					        myApp.hidePreloader();
		                	//myApp.alert('Koneksi ke Server Bermasalah','');
		                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
								myApp.confirm('Ingin keluar aplikasi?', '', function () {
							        navigator.app.exitApp();
							    });
							});
					    }
					});
		        }
		        function back_transaksi(){
		        	$('#jud').hide();
				    $('#detail').hide();
		        	$("#load-detail").empty();
		        	 myApp.closeModal('.popup-transaksi');
		        }
	        
	        // Menu History
	        function history(){
	        	var ambilDAta      = localStorage.getItem("tampung");
	     		var amet2          = JSON.parse(ambilDAta);
	            var token 		   = amet2[3];
	        	var cust_account_id= amet2[5];
	            myApp.showPreloader();
			    $.ajax({
				    url: server+"history_transaksi"+"/"+token,
				    type: "post",
				    data: {cust_account_id:cust_account_id},
				    success: function (response) {             
				    	var res = JSON.parse(response);
				    	if(res.code==1){
				    		myApp.popup('.popup-history');
			                myApp.hidePreloader();	
			                $("#history_disini").empty();
			                var no = 1;
			                $.each(res.data, function(key,val){ 
			                	var str = val.periode_pelaporan;
			                	var pisah = str.split(" ");
			                	//alert(pisah[3]);
			                	if (pisah[0] == 'JANUARY' && pisah[1] != '') {
			                		pisah[0] = 'JAN';
			                	}
			                	else if (pisah[0] == 'OCTOBER' && pisah[1] == '' && pisah[3] == pisah[3]) {
			                		pisah[0] = 'OCT '+pisah[3];
			                	}
			                	else if (pisah[0] == 'AUGUST' && pisah[1] == '' && pisah[4] == pisah[4]) {
			                		pisah[0] = 'AUG '+pisah[4];
			                	}
			                	else if (pisah[0] == 'JULY' && pisah[1] == '' && pisah[6] == pisah[6]) {
			                		pisah[0] = 'JUL '+pisah[6];
			                	}
			                	else if (pisah[0] == 'JUNE' && pisah[1] == '' && pisah[6] == pisah[6]) {
			                		pisah[0] = 'JUN '+pisah[6];
			                	}
			                	else if (pisah[0] == 'MAY' && pisah[1] == '' && pisah[7] == pisah[7]) {
			                		pisah[0] = 'MAY '+pisah[7];
			                	}
			                	else if (pisah[0] == 'APRIL' && pisah[1] == '' && pisah[5] == pisah[5]) {
			                		pisah[0] = 'APR '+pisah[5];
			                	}
			                	else if (pisah[0] == 'MARCH' && pisah[1] == '' && pisah[5] == pisah[5]) {
			                		pisah[0] = 'MAR '+pisah[5];
			                	}
			                	else if (pisah[0] == 'FEBRUARY' && pisah[1] == '' && pisah[2] == pisah[2]) {
			                		pisah[0] = 'FEB '+pisah[2];
			                	}
			                	else if (pisah[0] == 'JANUARY' && pisah[1] == '' && pisah[3] == pisah[3]) {
			                		pisah[0] = 'JAN '+pisah[3];
			                	}
			                	else if (pisah[0] == 'FEBRUARY') {
			                		pisah[0] = 'FEB';
			                	}
			                	else if (pisah[0] == 'MARCH') {
			                		pisah[0] = 'MAR';
			                	}
			                	else if (pisah[0] == 'APRIL') {
			                		pisah[0] = 'APR';
			                	}
			                	else if (pisah[0] == 'MAY') {
			                		pisah[0] = 'MAY';
			                	}
			                	else if (pisah[0] == 'JUNE') {
			                		pisah[0] = 'JUN';
			                	}
			                	else if (pisah[0] == 'JULY') {
			                		pisah[0] = 'JUL';
			                	}
			                	else if (pisah[0] == 'AUGUST') {
			                		pisah[0] = 'AUG';
			                	}
			                	else if (pisah[0] == 'SEPTEMBER') {
			                		pisah[0] = 'SEP';
			                	}
			                	else if (pisah[0] == 'OCTOBER') {
			                		pisah[0] = 'OCT';
			                	}
			                	else if (pisah[0] == 'NOVEMBER') {
			                		pisah[0] = 'NOV';
			                	}
			                	else{
			                		pisah[0] = 'DEC';
			                	}
							    var markup = "<tr onclick='cetak_opsi("+val.t_vat_setllement_id+","+val.t_customer_order_id+","+val.payment_key_1+","+val.p_vat_type_dtl_id+","+val.t_cust_account_id+","+val.day_start_date+","+val.day_end_date+","+val.month_date+","+val.year_date+")'><td style='border-bottom: 1px solid #111; text-align: center;'>"+no+"</td><td style='height: 47px; border-bottom: 1px solid #111;'><center>"+val.type_code+"</center></td><td style='border-bottom: 1px solid #111; text-align: center;'>"+pisah[0]+' '+pisah[1]+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.tgl_pelaporan+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+convertToRupiah(Math.round(val.total_transaksi))+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+convertToRupiah(Math.round(val.total_pajak))+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.payment_key_1+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.kenaikan_1+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.kenaikan_2+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.total_denda+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.kuitansi_pembayaran+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+convertToRupiah(Math.round(val.total_hrs_bayar))+"</td><td style='border-bottom: 1px solid #111; text-align: center;'>"+val.lunas+"</td></tr>";
		            			$("#history_disini").append(markup);
		            			no++;
							});
			                // pagination
			                $(".pager").remove();
							$('table.paginated').each(function() {
							    var currentPage = 0;
							    var numPerPage = 10;
							    var $table = $(this);
							    $table.bind('repaginate', function() {
							        $table.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
							    });
							    $table.trigger('repaginate');
							    var numRows = $table.find('tbody tr').length;
							    var numPages = Math.ceil(numRows / numPerPage);
							    var $pager = $('<div class="pager" id="paging" style="padding-bottom: 10px;"></div>');
							    for (var page = 0; page < numPages; page++) {
							        $('<span class="page-number"></span>').text(page + 1).bind('click', {
							            newPage: page
							        }, function(event) {
							            currentPage = event.data['newPage'];
							            $table.trigger('repaginate');
							            $(this).addClass('active').siblings().removeClass('active');
							        }).appendTo($pager).addClass('clickable');
							    }
							    $pager.insertAfter('#sini').find('span.page-number:first').addClass('active');
							});
			            }
			            else {
			                myApp.hidePreloader();
			                myApp.alert(res.message,'');
			            }
				    },
				    error: function(jqXHR, textStatus, errorThrown) {
				        console.log(textStatus, errorThrown);
				        myApp.hidePreloader();
	                	//myApp.alert('Koneksi ke Server Bermasalah','');
	                	myApp.alert('Koneksi ke Server Bermasalah', '', function () {
							myApp.confirm('Ingin keluar aplikasi?', '', function () {
						        navigator.app.exitApp();
						    });
						});
				    }
				});
	        }
	        	// opsi cetak
		        function cetak_opsi(vat_setllement_id,customer_order_id,payment_key_1,ref_vat_type_dtl_id,dat_cust_account_id,day_start_date,day_end_date,month_date,year_date){
		        	if (day_start_date < 10 || month_date < 10) {
		        		var mulai_tgl = '0'+day_start_date+'-0'+month_date+'-'+year_date;
		        		var akhir_tgl = day_end_date+'-0'+month_date+'-'+year_date;
		        	}
		        	else{
		        		var mulai_tgl = day_start_date+'-'+month_date+'-'+year_date;
		        		var akhir_tgl = day_end_date+'-'+month_date+'-'+year_date;
		        	}
		        	$$('#c_sptpd').val(vat_setllement_id);
		        	$$('#c_sspd').val(customer_order_id);
		        	$$('#c_bayar').val(payment_key_1);
		        	$$('#c_end_period').val(akhir_tgl);
					$$('#c_start_period').val(mulai_tgl);
					$$('#ref_vat_type_dtl_id').val(ref_vat_type_dtl_id);
					$$('#dat_cust_account_id').val(dat_cust_account_id);
		        	myApp.popup('.picker-1');
		        }
		        function cetak_sptpd() {
					var t_vat_setllement_id = $$('#c_sptpd').val();
					window.open('http://45.118.112.231/mpd/report/cetak_sptpd_hotel_pdf.php?t_vat_setllement_id='+t_vat_setllement_id, '_system');
				}
				function cetak_sspd() {
					var t_customer_order_id = $$('#c_sspd').val();
					window.open('http://45.118.112.231/mpd/report/cetak_formulir_sspd_pdf.php?t_customer_order_id='+t_customer_order_id, '_system');
				}
				function cetak_rekap() {
					var end_period   		= $$('#c_end_period').val();
					var start_period 		= $$('#c_start_period').val();
					var ref_vat_type_dtl_id = $$('#ref_vat_type_dtl_id').val();
					var dat_cust_account_id = $$('#dat_cust_account_id').val();
					window.open('http://45.118.112.234:10119/wajib-pajak/transaksi_harian/print_transaksi_harian?date_end='+end_period+'&date_start='+start_period+'&p_vat_type_dtl_id='+ref_vat_type_dtl_id+'&t_cust_account_id='+dat_cust_account_id, '_system');
				}
				function cetak_bayar() {
					var no_bayar = $$('#c_bayar').val();
					window.open('http://45.118.112.231/mpd/report/cetak_no_bayar.php?no_bayar='+no_bayar, '_system');
				}            

	        // Kalender
	        var calendarDefault = myApp.calendar({
	            input: '#calendar-default',
	        });    
	        var calendarDefault1 = myApp.calendar({
	            input: '#calendar-default1',
	        });    
	        var calendarDefault1 = myApp.calendar({
	            input: '#tanggal',
	        });
	        var calendarDefault1 = myApp.calendar({
	            input: '#edt_tanggal',
	        }); 