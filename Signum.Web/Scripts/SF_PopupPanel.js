﻿function OpenPopup(urlController, divASustituir, prefix, onOk, onCancel, detailDiv, partialView) {
    $('#' + prefix + sfTicks).val(new Date().getTime());
    OpenPopupCommon(urlController, onOk, onCancel, divASustituir, prefix, detailDiv, partialView);
}

function NewPopup(urlController, divASustituir, prefix, onOk, onCancel, isEmbeded, detailDiv, partialView) {
    $('#' + prefix + sfEntity).after("<input type='hidden' id='" + prefix + sfIsNew + "' name='" + prefix + sfIsNew + "' value='' />\n");
    if ($('#' + prefix + sfImplementations).length == 0)
        $('#' + prefix + sfRuntimeType).val($('#' + prefix + sfStaticType).val());
    OpenPopup(urlController, divASustituir, prefix, onOk, onCancel, detailDiv, partialView);
}

function NewDetail(urlController, divASustituir, prefix, detailDiv, isEmbeded, partialView) {
    NewPopup(urlController, divASustituir, prefix, "", "", isEmbeded, detailDiv, partialView);
    toggleButtonsDisplay(prefix, true);
    $('#' + prefix + sfTicks).val(new Date().getTime());
}

//function OpenDetail(urlController, divASustituir, prefix, onOk, onCancel, detailDiv, reloadOnChangeFunction) {
//    OpenPopup(urlController, divASustituir, prefix, onOk, onCancel, detailDiv);
//    toggleButtonsDisplay(prefix, true);

//    if (!empty(reloadOnChangeFunction)) {
//        $('#' + prefix + sfTicks).val(new Date().getTime());
//        reloadOnChangeFunction();
//    }
//}

function OpenPopupList(urlController, divASustituir, select, onOk, onCancel, detailDiv) {
    $('#' + select + sfTicks).val(new Date().getTime());
    
    if (!empty(detailDiv))
        $("#" + detailDiv).hide();
    
    var selected = $('#' + select + " > option:selected");
    if (selected.length == 0)
        return;
    
    var nameSelected = selected[0].id;
    var prefixSelected = nameSelected.substr(0, nameSelected.indexOf(sfToStr));
    OpenPopupCommon(urlController, onOk, onCancel, divASustituir, prefixSelected, detailDiv);
}

function NewPopupList(urlController, divASustituir, select, onOk, onCancel, runtimeType, isEmbeded, detailDiv) {
    $('#' + select + sfTicks).val(new Date().getTime());
    
    if (!empty(detailDiv))
        $("#" + detailDiv).hide();
    
    NewListOption(select, runtimeType, isEmbeded, detailDiv);

    var selected = $('#' + select + " > option:selected");
    if (selected.length == 0)
        return;
        
    var nameSelected = selected[0].id;
    var prefixSelected = nameSelected.substr(0, nameSelected.indexOf(sfToStr));
    $('#' + prefixSelected + sfEntity).after("<input type='hidden' id='" + prefixSelected + sfIsNew + "' name='" + prefixSelected + sfIsNew + "' value='' />\n");
    OpenPopupCommon(urlController, onOk, onCancel, divASustituir, prefixSelected, detailDiv);
}

function OpenPopupCommon(urlController, onOk, onCancel, divASustituir, prefix, detailDiv, partialView) {
    var containedEntity = $('#' + prefix + sfEntity).html();
    if (!empty(containedEntity)) { //Already have the containedEntity loaded => show it
        window[prefix + sfEntityTemp] = containedEntity;
        ShowPopup(prefix, prefix + sfEntity, "modalBackground", "panelPopup", detailDiv);
        $('#' + prefix + sfBtnOk).unbind('click').click(onOk);
        $('#' + prefix + sfBtnCancel).unbind('click').click(onCancel);
        return;
    }

    var runtimeType = $('#' + prefix + sfRuntimeType).val();
    if (empty(runtimeType)) {
        window.alert("Error: RuntimeType could not be solved");
        return;
    }
    
    var idQueryParam = "";
    var idField = $('#' + prefix + sfId);
    if (idField.length > 0)
        idQueryParam = qp("sfId", idField.val());

    var reactiveParam = "";
    if ($('#' + sfReactive).length > 0) { //If reactive => send also tabId and Id & Runtime of the main entity
        reactiveParam = qp(sfReactive, true);
        reactiveParam += qp(sfTabId, $('#' + sfTabId).val());
        reactiveParam += qp(sfRuntimeType, $('#' + sfRuntimeType).val());
        reactiveParam += qp(sfId, $('#' + sfId).val());
    }
    
    var viewQueryParam = "";
    if (!empty(partialView))
        viewQueryParam = qp("sfUrl", partialView);
    $.ajax({
        type: "POST",
        url: urlController,
        data: "sfRuntimeType=" + runtimeType + qp("sfOnOk",onOk) + qp("sfOnCancel",onCancel) + qp(sfPrefix, prefix) + idQueryParam + reactiveParam + viewQueryParam,
        async: false,
        dataType: "html",
        success:
                   function(msg) {
                       window[prefix + sfEntityTemp] = containedEntity;
                       if (!empty(detailDiv)) 
                            $('#' + detailDiv).html(msg);
                       else
                            $('#' + prefix + sfEntity).html(msg);
                       ShowPopup(prefix, prefix + sfEntity, "modalBackground", "panelPopup", detailDiv);
                       $('#' + prefix + sfBtnOk).click(onOk);
                       $('#' + prefix + sfBtnCancel).click(onCancel);
                   },
        error:
                   function(XMLHttpRequest, textStatus, errorThrown) {
                        ShowError(XMLHttpRequest, textStatus, errorThrown);
                   }
    });
}

function ChooseImplementation(divASustituir, prefix, onOk, onCancel) {
    ShowPopup(prefix, prefix + sfImplementations, "modalBackground", "panelPopup", null);
    $('#' + prefix + sfBtnOk).unbind('click').click(onOk);
    $('#' + prefix + sfBtnCancel).unbind('click').click(onCancel);
}

function ShowPopup(prefix, globalKey, modalBackgroundKey, panelPopupKey, detailDiv) {
    if (!empty(detailDiv))
        $("#" + detailDiv).show();
    else {
        //$("#" + prefix + sfEntity).show();
        $("#" + globalKey).show();
        $('#' + prefix + modalBackgroundKey).width(document.documentElement.clientWidth).height(document.documentElement.clientHeight).hide();

        //Read offsetWidth and offsetHeight after display=block or otherwise it's 0
        var popup = $('#' + prefix + panelPopupKey)[0];
        var parentDiv = $("#" + prefix + sfEntity).parent();
        var popupWidth = popup.offsetWidth;
        var bodyWidth = document.body.clientWidth;
        var left = Math.max((bodyWidth - popupWidth) / 2, 10) + "px";
        var popupHeight = popup.offsetHeight;
        var bodyHeight = document.documentElement.clientHeight;
        var top = Math.max((bodyHeight - popupHeight) / 2, 10) + "px";
       
        $('#' + globalKey).hide();
        popup.style.left = left;
        popup.style.top = top;
        popup.style.width = popupWidth + "px";
        $('#' + globalKey).show('fast');
        $('#' + prefix + modalBackgroundKey)[0].style.left=0;
        $('#' + prefix + modalBackgroundKey).css('filter','alpha(opacity=40)').fadeIn('slow');
    }
}

function OnPopupOK(urlController, prefix, reloadOnChangeFunction) {
    var correct = ValidatePartial(urlController, prefix, "", true, "*");

    window[prefix + sfEntityTemp] = "";
    $('#' + prefix + sfEntity).hide();

    toggleButtonsDisplay(prefix, true);

    if (!empty(reloadOnChangeFunction)) {
        $('#' + prefix + sfTicks).val(new Date().getTime());
        reloadOnChangeFunction();
    }
}

function OnListPopupOK(urlController, prefix, btnOkId, reloadOnChangeFunction) {
    var itemPrefix = btnOkId.substr(0, btnOkId.indexOf(sfBtnOk));
    var correct = ValidatePartial(urlController, itemPrefix, "", true, "*");

    window[itemPrefix + sfEntityTemp] = "";
    $('#' + itemPrefix + sfEntity).hide();

    toggleButtonsDisplayList(prefix, true);//prefix=itemPrefix.substr(0, itemPrefix.lastIndexOf("_"))
    
    if (!empty(reloadOnChangeFunction)) {
        $('#' + prefix + sfTicks).val(new Date().getTime());
        reloadOnChangeFunction();
    }
}

function ReloadEntity(urlController, prefix, parentDiv) {
    var formChildren = $("form");
    $.ajax({
        type: "POST",
        url: urlController,
        data: formChildren.serialize() + qp(sfPrefix,prefix),
        async: false,
        dataType: "html",
        success:
                   function(msg) {
                       if (!empty(parentDiv))
                            $('#' + parentDiv).html(msg);
                       else
                            $('#' + prefix + "divMainControl").html(msg);
                   },
        error:
                   function(XMLHttpRequest, textStatus, errorThrown) {
                       ShowError(XMLHttpRequest, textStatus, errorThrown);
                   }
    });
}

function OnImplementationsOk(urlController, divASustituir, prefix, onOk, onCancel, isEmbeded, selectedType) {
    if (empty(selectedType))
        return;
    $('#' + prefix + sfRuntimeType).val(selectedType);
    $('#' + prefix + sfImplementations).hide();
    NewPopup(urlController, divASustituir, prefix, onOk, onCancel, isEmbeded);
}

function NewListOption(prefix, selectedType, isEmbeded, detailDiv) {
    var lastElement = $('#' + prefix + " > option:last");
    var lastIndex = -1;
    if (lastElement.length > 0) {
        var nameSelected = lastElement[0].id;
        lastIndex = nameSelected.substring(prefix.length + 1, nameSelected.indexOf(sfToStr));
    }
    var newIndex = "_" + (parseInt(lastIndex) + 1);
    var staticType = $("#" + prefix + sfStaticType);
    staticType.after(
        "<input type='hidden' id='" + prefix + newIndex + sfRuntimeType + "' name='" + prefix + newIndex + sfRuntimeType + "' value='" + selectedType + "' />\n" +
        "<script type=\"text/javascript\">var " + prefix + newIndex + sfEntityTemp + " = '';</script>\n");
    var sfEntityDiv = "<div id='" + prefix + newIndex + sfEntity + "' name='" + prefix + newIndex + sfEntity + "' style='display:none'></div>\n";
    if (empty(detailDiv))
        staticType.after(sfEntityDiv);
    else
        $("#" + detailDiv).append(sfEntityDiv);
    if (isEmbeded == "False")
        staticType.after("<input type='hidden' id='" + prefix + newIndex + sfId + "' name='" + prefix + newIndex + sfId + "' value='' />\n");

    var select = $('#' + prefix);
    select.append("\n<option id='" + prefix + newIndex + sfToStr + "' name='" + prefix + newIndex + sfToStr + "' value='' class='valueLine'>&nbsp;</option>");
    $('#' + prefix + " > option").attr('selected', false); //Fix for Firefox: Set selected after retrieving the html of the select
    $('#' + prefix + " > option:last").attr('selected', true);
}

function OnListImplementationsOk(urlController, divASustituir, prefix, onOk, onCancel, isEmbeded, detailDiv, selectedType) {
    if (empty(selectedType))
        return;
    $('#' + prefix + sfImplementations).hide();
    NewPopupList(urlController, divASustituir, prefix, onOk, onCancel, selectedType, isEmbeded, detailDiv);
}

function OnImplementationsCancel(prefix) {
    $('#' + prefix + sfImplementations).hide();
}

function OnPopupCancel(prefix) {
    var oldValue = window[prefix + sfEntityTemp];
    $('#' + prefix + sfEntity).html(oldValue);
    
    var id = $('#' + prefix + sfId);
    if (id.length > 0 && id.val() != null && id.val() > 0)
        toggleButtonsDisplay(prefix, true);
    else {
        if (!empty(oldValue)) {
            toggleButtonsDisplay(prefix, true);
        }
        else {
            toggleButtonsDisplay(prefix, false);
            $('#' + prefix + sfRuntimeType).val("");
            $('#' + prefix + sfIsNew).remove();
        }
    }

    window[prefix + sfEntityTemp] = "";
    $('#' + prefix + sfEntity).hide();
}

function OnListPopupCancel(btnCancelId) {
    var itemPrefix = btnCancelId.substr(0, btnCancelId.indexOf(sfBtnCancel));
    var prefix = itemPrefix.substr(0, itemPrefix.lastIndexOf("_"));
    var oldValue = window[itemPrefix + sfEntityTemp];
    $('#' + itemPrefix + sfEntity).html(oldValue);

    var id = $('#' + itemPrefix + sfId);
    if (id.length > 0 && id.val() != null && id.val() > 0) {
        toggleButtonsDisplayList(prefix, true);
    }
    else {
        if (!empty(oldValue)) {
            toggleButtonsDisplayList(prefix, true);
        }
        else {
            toggleButtonsDisplayList(prefix, false);
            $('#' + itemPrefix + sfId).remove();
            $('#' + itemPrefix + sfRuntimeType).remove();
            $('#' + itemPrefix + sfToStr).remove();
            $('#' + itemPrefix + sfEntity).remove();
            $('#' + itemPrefix + sfIsNew).remove();
        }
    }

    window[itemPrefix + sfEntityTemp] = "";
    $('#' + itemPrefix + sfEntity).hide();
}

function RemoveListContainedEntity(select) {
    var selected = $('#' + select + " > option:selected");
    if (selected.length == 0)
        return;
    var nameSelected = selected[0].id;
    var prefixSelected = nameSelected.substr(0, nameSelected.indexOf(sfToStr));
     
    $('#' + prefixSelected + sfId).remove();
    $('#' + prefixSelected + sfRuntimeType).remove();
    $('#' + prefixSelected + sfToStr).remove();
    $('#' + prefixSelected + sfEntity).remove();
    $('#' + prefixSelected + sfIndex).remove();
    $('#' + prefixSelected + sfIsNew).remove();
    window[prefixSelected + sfEntityTemp] = "";

    $('#' + select + sfTicks).val(new Date().getTime());
            
    toggleButtonsDisplayList(select, $('#' + select + " > option").length > 0);
}

function RemoveContainedEntity(prefix, reloadOnChangeFunction) {
    $('#' + prefix + sfToStr).val("");
    $('#' + prefix + sfToStr).html("");
    $('#' + prefix + sfToStr).removeClass(sfInputErrorClass);
    $('#' + prefix + sfRuntimeType).val("");
    $('#' + prefix + sfIsNew).remove();
    window[prefix + sfEntityTemp] = "";
    
    var idField = $('#' + prefix + sfId);
    $('#' + prefix + sfEntity).html("");
    $('#' + prefix + sfId).val("");
    toggleButtonsDisplay(prefix, false);

    if (!empty(reloadOnChangeFunction)) {
        $('#' + prefix + sfTicks).val(new Date().getTime());
        reloadOnChangeFunction();
    }
}

function RemoveDetailContainedEntity(prefix, detailDiv, reloadOnChangeFunction) {
    $('#' + prefix + sfToStr).val("");
    $('#' + prefix + sfToStr).html("");
    $('#' + prefix + sfToStr).removeClass(sfInputErrorClass);
    $('#' + prefix + sfRuntimeType).val("");
    $('#' + prefix + sfIsNew).remove();
    window[prefix + sfEntityTemp] = "";

    var idField = $('#' + prefix + sfId);
    $('#' + prefix + sfId).val("");
    $('#' + detailDiv).html("");

    toggleButtonsDisplay(prefix, false);

    if (!empty(reloadOnChangeFunction)) {
        $('#' + prefix + sfTicks).val(new Date().getTime());
        reloadOnChangeFunction();
    }
}

var autocompleteOnSelected = function(extendedControlName, newIdAndType, newValue, hasEntity) {
    var prefix = extendedControlName.substr(0, extendedControlName.indexOf(sfToStr));
    var _index = newIdAndType.indexOf("_");
    $('#' + prefix + sfId).val(newIdAndType.substr(0, _index));
    $('#' + prefix + sfRuntimeType).val(newIdAndType.substr(_index+1, newIdAndType.length));
    $('#' + prefix + sfLink).html($('#' + extendedControlName).val());
    $('#' + prefix + sfTicks).val(new Date().getTime());
    toggleButtonsDisplay(prefix, hasEntity);
}

function EntityComboOnChange(prefix) {
    var selected = $("#" + prefix + sfCombo + " > option:selected");
    if (selected.length == 0)
        return;
    $("#" + prefix + sfId).val(selected.val());
    if (selected.val() != "") {
        $("#" + prefix + sfRuntimeType).val($("#" + prefix + sfStaticType).val());
        toggleButtonsDisplay(prefix, true);
    }
    else {
        $("#" + prefix + sfRuntimeType).val("");
        toggleButtonsDisplay(prefix, false);
    }
    window[prefix + sfEntityTemp] = "";
    $('#' + prefix + sfEntity).html("");
}

function OnPopupComboOk(urlController, prefix) {
    ValidatePartial(urlController, prefix, "", true, "");

    //Clean panelPopup
    window[prefix + sfEntityTemp] = "";
    $('#' + prefix + sfEntity).hide();

    var runtimeType = $('#' + prefix + sfRuntimeType);
    if (runtimeType.val() == "")
        runtimeType.val($('#' + prefix + sfStaticType).val());

    toggleButtonsDisplay(prefix, true);
}

function OnPopupComboCancel(prefix) {
    window[prefix + sfEntityTemp] = "";
    $('#' + prefix + sfEntity).hide();
}

function toggleButtonsDisplay(prefix, hasEntity) {
    var btnCreate = $('#' + prefix + "_btnCreate");
    var btnRemove = $('#' + prefix + "_btnRemove");
    var btnFind = $('#' + prefix + "_btnFind");
    var btnView = $('#' + prefix + "_btnView");
    var link = $('#' + prefix + sfLink);
    var txt = $('#' + prefix + sfToStr);
    
    if (hasEntity == true) {
        link.show();
        if (link.html() == "")
            link.html("&nbsp;");
        txt.hide();
        btnCreate.hide();
        btnFind.hide();
        btnRemove.show();
        btnView.show();
    }
    else {
        link.hide();
        txt.show();
        btnCreate.show();
        btnFind.show();
        btnRemove.hide();
        btnView.hide();
    }
}

function toggleButtonsDisplayList(prefix, hasEntity) {
    var btnRemove = $('#' + prefix + "_btnRemove");
    if (hasEntity == true)
        btnRemove.show();
    else
        btnRemove.hide();
}

function NewRepeaterElement(urlController, prefix, runtimeType, isEmbedded, removeLinkText, maxElements) {
    $('#' + prefix + sfTicks).val(new Date().getTime());
    if (!empty(maxElements)) {
        var elements = $("#" + prefix + sfEntitiesContainer + " > div[name$=" + sfRepeaterElement + "]").length;
        if (elements >= parseInt(maxElements))
            return;
    }
    var lastElement = $("#" + prefix + sfEntitiesContainer + " > div[name$=" + sfRepeaterElement + "]:last");
    var lastIndex = -1;
    if (lastElement.length > 0) {
        var nameSelected = lastElement[0].id;
        lastIndex = nameSelected.substring(prefix.length + 1, nameSelected.indexOf(sfRepeaterElement));
    }
    var newIndex = "_" + (parseInt(lastIndex) + 1);

    $.ajax({
        type: "POST",
        url: urlController,
        data: "sfRuntimeType=" + runtimeType + qp(sfPrefix, prefix + newIndex),
        async: false,
        dataType: "html",
        success:
                   function(msg) {
                       var newPrefix = prefix + newIndex;
                       $("#" + prefix + sfEntitiesContainer).append("\n" +
                        "<div id='" + newPrefix + sfRepeaterElement + "' name='" + newPrefix + sfRepeaterElement + "' class='repeaterElement'>\n" +
                        "<a id='" + newPrefix + "_btnRemove' title='" + removeLinkText + "' href=\"javascript:RemoveRepeaterEntity('" + newPrefix + sfRepeaterElement + "');\" class='lineButton remove'>" + removeLinkText + "</a>\n" +
                        "<input type='hidden' id='" + newPrefix + sfRuntimeType + "' name='" + newPrefix + sfRuntimeType + "' value='" + runtimeType + "' />\n" +
                        ((isEmbedded == "False") ? ("<input type='hidden' id='" + newPrefix + sfId + "' name='" + newPrefix + sfId + "' value='' />\n") : "") +
                       //"<input type=\"hidden\" id=\"" + newPrefix + sfIndex + "\" name=\"" + newPrefix + sfIndex + "\" value=\"" + (parseInt(lastIndex)+1) + "\" />\n" +
                        "<input type='hidden' id='" + newPrefix + sfIsNew + "' name='" + newPrefix + sfIsNew + "' value='' />\n" +
                        "<script type=\"text/javascript\">var " + newPrefix + sfEntityTemp + " = '';</script>\n" +
                        "<div id='" + newPrefix + sfEntity + "' name='" + newPrefix + sfEntity + "'>\n" +
                        msg + "\n" +
                        "</div>\n" + //sfEntity
                        "</div>\n" //sfRepeaterElement                        
                        );
                   },
        error:
                   function(XMLHttpRequest, textStatus, errorThrown) {
                       ShowError(XMLHttpRequest, textStatus, errorThrown);
                   }
    });
}

function RemoveRepeaterEntity(idRepeaterElement, prefix, reloadOnChangeFunction) {
    $("#" + idRepeaterElement).remove();
    
    if (!empty(reloadOnChangeFunction)) {
        $('#' + prefix + sfTicks).val(new Date().getTime());
        reloadOnChangeFunction();
    }
}
