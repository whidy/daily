+++
title = "Visual Studio Code几款FTP插件使用总结"
date = "2018-02-13"
author = "whidy"
+++

# Visual Studio Code几款FTP插件使用总结

平时要维护类似wordpress这样的网站，然后虚拟主机又不支持远程仓的版本管理。总而言之，只能通过下载到本地修改后再通过FTP上传的情况，每次修改后都要开启FTP进行代码提交，相当繁琐。因此就诞生了一些编辑器的FTP插件，其实以前用sublime text的时候还有款插件叫[SFTP](https://packagecontrol.io/packages/SFTP)不错（如果配置好了连接不上可以参考[SFTP连接超时](https://www.whidy.net/sublime-text-sftp-connection-timeout.html)），可惜VSCODE上面没有，截至目前（2018年1月17日）可以用的FTP插件如下图：

![vscode的ftp插件](https://www.whidy.net/wp-content/uploads/2018/01/01.png "vscode的ftp插件")

为了找出最合适的插件，我全部都一个个试过了(关于如何使用参考插件说明， 十分简单就不多说了)。然后有以下感想：

1. ftp-sync是测试中的唯一一个感觉还可以的，但是菜单为啥不全，感觉是一个BUG吧。希望后期能够优化。
  ![ftp-sync菜单](https://www.whidy.net/wp-content/uploads/2018/01/02-1.png "ftp-sync菜单")
1. SFTP/FTP sync总是回莫名其妙的卡住(左下角提示transfer就不动了)，而且相同文件好像也会再次覆盖，不会跳过.文件比较多的时候出问题，不建议使用。
1. ~~ftp-kr跟Simple FTP/SFTP一样没啥暖用，还不如就用ftp软件操作~~
1. ~~Simple FTP/SFTP没啥暖用，还不如就用ftp软件操作~~

写到最后感觉很惨，没有一个真正好用的，而且连ftp传输状态信息也没有。有时候比较惨的误操作了需要中断传输，貌似只能强制关闭编辑器...

然后我还是用sublime text 的SFTP来维护需要涉及到FTP文件同步的项目了。当然如果你不怎么用sublime text的话，个人建议使用ftp-sync，毕竟目前来看，它在VSCode上表现还是不错的，有潜力，也期待作者进一步优化~