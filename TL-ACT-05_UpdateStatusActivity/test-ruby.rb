require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)

    wait.until { @driver.find_element(:css => '#activity-list li').displayed? }

    puts @driver.find_element(:css => '#activity-list li').displayed?

    target = @testCase['testCases']['target'].split("#")
    url = target.first
    actionCheck = target.last
    id = url.gsub("http://todo.app/activity/","").gsub("/check","")

    puts id;


    wait.until {
      @driver.find_element(:css => "#activity-list>li").displayed?
    }

    begin
      check = @driver.find_element :css => "#activity-#{id} a.check"
    rescue
      check = @driver.find_element :css => "#activity-list>li:first-child>a.check"
      @driver.execute_script("arguments[0].setAttribute('href','#{url}')" , check)
    end
    
    beforeClassElm = check.attribute("class")
    puts beforeClassElm

    check.click

    wait.until {
      begin
        afterClassElm = check.attribute("class")
        if afterClassElm != beforeClassElm
          el = check
        end
      rescue
        @driver.find_element(:css => ".uk-alert.uk-alert-danger p").displayed?
      end
    }

    result = Array.new

    begin
      afterClassElm = check.attribute("class")
      puts afterClassElm
      if afterClassElm != beforeClassElm
        return true
      end
    rescue
      respons = @driver.find_elements(:css => ".uk-alert.uk-alert-danger p")   
      respons.each do |respon|
        result.push respon.text
      end
      expect = @testCase['messages']
      puts expect
      puts "////"
      puts result
      return Set.new(expect) === Set.new(result)
    end
    
    
  end
end
