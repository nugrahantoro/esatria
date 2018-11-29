function js_str_replace (search, replace, subject, count) {
            f = [].concat(search),
            r = [].concat(replace),
            s = subject,
            ra = r instanceof Array, sa = s instanceof Array;    s = [].concat(s);
    if (count) {
        this.window[count] = 0;
    }
     for (i=0, sl=s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j=0, fl=f.length; j < fl; j++) {            temp = s[i]+'';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) {
                this.window[count] += (temp.length-s[i].length)/f[j].length;}        }
    }
    return sa ? s : s[0];
}

function cadelete(){
	for (var i=0;i<document.fmDelete.elements.length;i++) {
		var e = document.fmDelete.elements[i];
		if ((e.name != 'deletebox') && (e.type=='checkbox') && (e.name.substring(0,6) == 'Delete'))
		{
			e.checked = document.fmDelete.deletebox.checked;
		}
	}
}

function msg_war(a){
	$('.nilai').empty();$('.fnilai').empty();
	$('.nilai').append(a);
	$('.fnilai').append('<a class="boxsimpan" href="#" onClick="msg_close();">OK</a>');
	document.getElementById('box_war').style.display='block';
	document.getElementById('shadowing_war').style.display='block';
}

function msg_war2(a){
	$('.nilai2').empty();$('.fnilai2').empty();
	$('.nilai2').append(a);
	$('.fnilai2').append('<a class="boxsimpan" href="#" onClick="msg_close2();">OK</a>');
	document.getElementById('box_war2').style.display='block';
	document.getElementById('shadowing_war2').style.display='block';
}

function msg_war3(a){
	$('.nilai3').empty();$('.fnilai3').empty();
	$('.nilai3').append(a);
	$('.fnilai3').append('<a class="boxsimpan" href="#" onClick="msg_close3();">OK</a>');
	document.getElementById('box_war3').style.display='block';
	document.getElementById('shadowing_war3').style.display='block';
}

function msg_del(){
	$('.nilai').empty();$('.fnilai').empty();
	$('.nilai').append('Anda yakin ingin menghapus data yang telah dipilih ?');
	$('.fnilai').append('<a class="boxsimpan" href="#" onClick="fmDelete.submit();">OK</a> <a class="boxbatal" href="#" onClick="msg_close();">TIDAK</a>');
	document.getElementById('box_war').style.display='block';
	document.getElementById('shadowing_war').style.display='block';
}

function msg_close()
{
	$('.nilai').empty();$('.fnilai').empty();
	document.getElementById('box_war').style.display='none';
	document.getElementById('shadowing_war').style.display='none';
}

function msg_close2()
{
	$('.nilai2').empty();$('.fnilai2').empty();
	document.getElementById('box_war2').style.display='none';
	document.getElementById('shadowing_war2').style.display='none';
}

function msg_close3()
{
	$('.nilai3').empty();$('.fnilai3').empty();
	document.getElementById('box_war3').style.display='none';
	document.getElementById('shadowing_war3').style.display='none';
}

function List(v)
{
	for(var i=1 ; i <= 8 ; i++){
		var c = 'list'+i;
		if(c!=v){
			document.getElementById(c).style.display='none';
		}
	}
	
	p = document.getElementById(v).style.display;
	document.getElementById(v).style.display=(p=='none')?'block':'none';
}

function angka(objek) 
{
	objek = typeof(objek) != 'undefined' ? objek : 0;
	a = objek.value;
	b = a.replace(/[^\d]/g,"");
	c = "";
	panjang = b.length;
	j = 0;
	for (i = panjang; i > 0; i--) {
		j = j + 1;
		if (((j % 3) == 1) && (j != 1)) {
		c = b.substr(i-1,1) + "," + c;
		} else {
			c = b.substr(i-1,1) + c;
		}
	}
	objek.value = c;
}

function angka_saja(objek) 
{
	objek = typeof(objek) != 'undefined' ? objek : 0;
	a = objek.value;
	b = a.replace(/[^\d]/g,"");
	c = "";
	panjang = b.length;
	j = 0;
	for (i = panjang; i > 0; i--) {
		j = j + 1;
		if (((j % 3) == 1) && (j != 1)) {
		c = b.substr(i-1,1) + c;
		} else {
			c = b.substr(i-1,1) + c;
		}
	}
	objek.value = c;
}


function js_number_format(number, decimals, dec_point, thousands_sep) {
    number = (number+'').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number, 
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }    return s.join(dec);
}

function js_tglEngInd(tgl){
	if (tgl != null && tgl != '0000-00-00') {
		tgl_ind= tgl.substr(8,2)+ "-"+ tgl.substr(5,2)+"-"+tgl.substr(0,4);
		return tgl_ind;
	}
}
